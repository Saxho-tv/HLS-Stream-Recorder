const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { spawn } = require('child_process');
const config = require('./config.json');

moment.locale('en'); // Use English locale for dates
const app = express();
const PORT = config.PORT;
const RECORDINGS_DIR = path.join(__dirname, config.RECORDING_FOLDER);

// Create recordings directory if it doesn't exist
if (!fs.existsSync(RECORDINGS_DIR)) {
    fs.mkdirSync(RECORDINGS_DIR);
}

// Load streams from config
const HLS_STREAMS = config.STREAMS;

if (!Array.isArray(HLS_STREAMS) || HLS_STREAMS.length === 0) {
    logWithTimestamp('❌ No valid streams found in config.json. Exiting...');
    process.exit(1);
}
//----------------------------------------------------------------------------//

// Function to get current date and time using configured timezone
function now() {
    return moment.tz(config.TIMEZONE);
}

// Function to log messages with timestamp
function logWithTimestamp(message) {
    const timestamp = now().format('YYYY-MM-DD HH:mm:ss');
    console.log(`[${timestamp}] ${message}`);
}

// Function to manage continuous recording with automatic restart on new hour
async function startContinuousRecording(stream) {
    const startTime = now();
    logWithTimestamp(`Starting continuous recording for ${stream.name} at ${startTime.format('YYYY-MM-DD HH:mm:ss')}`);

    // Infinite loop to restart recording every new hour
    while (true) {
        try {
            await recordStreamUntilNewHour(stream);
        } catch (error) {
            logWithTimestamp(`Error during recording: ${error.message}`);
        }

        // Wait a few seconds before restarting the recording to avoid conflicts
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

// Function to handle recording until next hour and continue existing file
async function recordStreamUntilNewHour(stream) {
    const startTime = now();
    logWithTimestamp(`Recording started for ${stream.name} at ${startTime.format('YYYY-MM-DD HH:mm:ss')}`);

    const streamUrl = stream.url;

    // Normalize stream name
    const streamNameNormalized = stream.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

    // Get current day and hour
    const day = startTime.format('dddd').toLowerCase();
    const hour = startTime.format('HH');
    const fileExtension = streamUrl.includes('.mp3') ? '.mp3' : '.aac';
    const fileName = `${stream.name.replace(/ /g, '-')}-${day}-${hour}h${fileExtension}`;
    const outputFile = path.join(RECORDINGS_DIR, fileName);

    // Check if file exists and is older than 7 days
    if (fs.existsSync(outputFile)) {
        const fileStat = fs.statSync(outputFile);
        const fileAge = moment().diff(moment(fileStat.mtime), 'days');

        if (fileAge >= 7) {
            logWithTimestamp(`Older than 7 days detected: ${outputFile}. Deleting...`);
            fs.unlinkSync(outputFile);
        } else {
            logWithTimestamp(`Continuing recording in existing file: ${outputFile}`);
        }
    } else {
        logWithTimestamp(`Creating new file: ${outputFile}`);
    }

    // FFmpeg arguments configuration
    let ffmpegArgs = [];
    if (streamUrl.endsWith('.m3u8')) {
        ffmpegArgs = [
            '-i', streamUrl,
            '-c:a', 'aac',
            '-f', 'adts',
            '-'
        ];
    }

    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(outputFile, { flags: 'a' });
        const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
        ffmpegProcess.stdout.pipe(writeStream);

        ffmpegProcess.stderr.on('data', (data) => {
            const stderrLine = data.toString();
            if (stderrLine.includes('Invalid argument')) {
                logWithTimestamp(`Error detected: Invalid arguments. Restarting recording.`);
                ffmpegProcess.kill();
                reject(new Error('Invalid arguments'));
            }
        });

        ffmpegProcess.on('error', (err) => {
            logWithTimestamp(`Error during recording: ${err.message}`);
            reject(err);
        });

        ffmpegProcess.on('close', (code) => {
            if (code !== 0) {
                logWithTimestamp(`FFmpeg exited with code ${code}`);
                reject(new Error(`FFmpeg exited with code ${code}`));
            } else {
                logWithTimestamp(`Recording finished: ${outputFile}`);
                resolve();
            }
        });

        // Detect hour change
        const intervalId = setInterval(() => {
            const currentHour = now().format('HH');

            if (currentHour !== hour) {
                deleteOldRecordings();
                logWithTimestamp(`New hour detected (${currentHour}): Stopping current recording.`);
                ffmpegProcess.kill();
                clearInterval(intervalId);
                resolve();
            }
        }, 1000);
    });
}

// Delete recordings older than 7 days
function deleteOldRecordings() {
    fs.readdir(RECORDINGS_DIR, (err, files) => {
        if (err) {
            logWithTimestamp(`Error reading recordings directory: ${err.message}`);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(RECORDINGS_DIR, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                const fileDate = moment(stats.mtime);
                if (moment().diff(fileDate, 'days') >= 7) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            logWithTimestamp(`Error deleting old file ${filePath}: ${err.message}`);
                        } else {
                            logWithTimestamp(`Deleted old file: ${filePath}`);
                        }
                    });
                }
            });
        });
    });
}

// Start continuous recordings immediately when server starts
HLS_STREAMS.forEach(async (stream) => {
    startContinuousRecording(stream).catch(err => {
        logWithTimestamp(`Critical error during continuous recording for ${stream.name}: ${err.message}`);
    });
});

// Start the server
app.listen(PORT, () => {
    logWithTimestamp(`Server started on http://localhost:${PORT}`);
});