// backend/utils/runSbertMatching.js
const { spawn } = require('child_process');
const path = require('path');

const runSbertMatching = (challengeText, candidateText) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../python/sbert_matcher.py'),
      challengeText,
      candidateText
    ]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python stderr:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}`);
      } else {
        resolve(parseFloat(result));
      }
    });
  });
};

module.exports = runSbertMatching;
