const fs = require('fs')
const execa = require('execa')


const targets = fs.readdirSync('packages').filter(f => fs.statSync(`packages/${f}`).isDirectory())
console.log('targets', targets);


async function build (target) {
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' })
}

function runParallel (targets, iteratorFn) {
    const res = []
    for (const item of targets) {
        const p = iteratorFn(item)
        res.push(p)
    }
    return Promise.all(res)
}

runParallel(targets, build)