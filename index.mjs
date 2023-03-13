import core from '@actions/core';
import {readFile, writeFile} from 'fs/promises';
import path from 'path';

const log = console;

async function parseFile(catalog) {
  try {
    const filepath = path.resolve(catalog);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = await readFile(new URL(filepath, import.meta.url));
    return JSON.parse(content);
  }
  catch (err) {
    log.warn('parseFile failed.', err);
    return {};
  }
}

function redoBuilds(props, builds = []) {
  if (removing) {
    return builds.filter((build) => build.ref !== props.ref);
  }
  return [...builds.filter((build) => build.ref !== props.ref), {
    ref: props.ref,
    label: props.label,
    sha: props.sha,
    updated: new Date().toISOString(),
  }];
}

try {
  const catalog = core.getInput('catalog');
  const removing = core.getInput('remove');
  const ref = core.getInput('ref');
  const sha = core.getInput('sha');
  const label = core.getInput('label');
  const repo = core.getInput('repo');
  const homepage = core.getInput('homepage');

  log.info(`Hello my action!`, {
    catalog,
    removing,
    ref,
    sha,
    label,
    repo,
    homepage,
  });

  const content = await parseFile(catalog);
  log.info('This is the current content:', content);

  const builds = redoBuilds({ref, label, sha, removing}, content?.builds);

  const newContent = {
    builds,
    homepage,
    repo,
  };

  log.info('This is gonna be new content:', newContent);

  const string = JSON.stringify(newContent, undefined, 2);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(catalog, string);

  log.info('Catalog script finished.');
} catch (error) {
  core.setFailed(error.message);
}

