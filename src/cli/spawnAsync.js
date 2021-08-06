const spawn = require('child_process').spawn;

async function spawnExecAsync(cmd, args = null, opts = {shell: true, detached: true}) {
  await new Promise((resolve, reject) => {
    let proc = spawn(cmd, args, opts);
    proc.stdout.on('data', (data) => {
      if (data) {
        console.log('> ' + data.toString().replace(/\r\n$/, ''));
      }
    });

    proc.stderr.on('data', (data) => {
      if (data) {
        console.error('> ' + data.toString().replace(/\r\n$/, ''));
      }
    });

    proc.on('error', error => {
      reject(error);
    });

    proc.on('close', (code, signal) => {
      console.log(`> Closing [${cmd}] with code ${code}`);
      if (code === 0) {
        return resolve(code);
      } else {
        return reject(code);
      }
    });

    proc.on('exit', (code, signal) => {
      console.log('> ' + `Exiting [${cmd}] with code ${code}`);
    });

    proc.on('message', (message, sendHandle) => {
      if (message) {
        console.log('> ' + `Receiving message: ${message.toString()}`);
      }
    });
  });
}

export {
  spawnExecAsync
}
