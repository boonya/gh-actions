import core from '@actions/core';
import github from '@actions/github';

try {
  const file = core.getInput('file');
  const repo = core.getInput('repo');
  const homepage = core.getInput('homepage');
  const ref = core.getInput('ref');
  const label = core.getInput('label');
  const sha = core.getInput('sha');

  console.log(`Hello my action!`, {
    file,
    repo,
    homepage,
    ref,
    label,
    sha,
  });
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

