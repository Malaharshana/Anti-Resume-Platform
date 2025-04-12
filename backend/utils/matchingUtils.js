const { exec } = require('child_process');
const path = require('path');

// Function to get matching score using the Python script
const getMatchingScore = (candidateSkills, challengeSkills) => {
  return new Promise((resolve, reject) => {
    const candidateSkillsString = candidateSkills.join(', ');
    const challengeSkillsString = challengeSkills.join(', ');

    const pythonScriptPath = path.join(__dirname, 'matching_script.py');

    // Execute the Python script
    exec(
      `python "${pythonScriptPath}" "${candidateSkillsString}" "${challengeSkillsString}"`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(`Error executing Python script: ${error.message}`);
        } else if (stderr) {
          return reject(`Python script stderr: ${stderr}`);
        }

        const cleanedOutput = stdout.trim();
        const score = parseFloat(cleanedOutput);

        if (isNaN(score)) {
          return reject('Invalid score returned from Python script');
        }

        resolve(score);
      }
    );
  });
};

module.exports = { getMatchingScore };
