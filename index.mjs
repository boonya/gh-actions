import core from '@actions/core';
import {readFile, writeFile} from 'fs/promises';
import path from 'path';

const log = console;

async function parseFile(file) {
	try {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
		const content = await readFile(new URL(file, import.meta.url));
		return JSON.parse(content);
	}
	catch (err) {
		log.warn('parseFile failed.', err);
		return {};
	}
}

function redoBuilds(props, builds = []) {
	return [...builds.filter((build) => build.label !== props.label), {
		ref: props.ref,
		label: props.label,
		sha: props.sha,
		updated: new Date().toISOString(),
	}];
}

try {
  const file = core.getInput('file');
  const repo = core.getInput('repo');
  const homepage = core.getInput('homepage');
  const ref = core.getInput('ref');
  const label = core.getInput('label');
  const sha = core.getInput('sha');

  log.info(`Hello my action!`, {
    file,
    repo,
    homepage,
    ref,
    label,
    sha,
  });

  const filepath = path.resolve(file);

  const content = await parseFile(filepath);
  log.info('This is the current content:', content);

  const builds = redoBuilds({ref,label,sha}, content?.builds);

  const newContent = {
    builds,
    homepage,
    repo,
  };

  log.info('This is gonna be new content:', newContent);

  const string = JSON.stringify(newContent, undefined, 2);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(file, string);

  log.info('Catalog script finished.');
} catch (error) {
  core.setFailed(error.message);
}

