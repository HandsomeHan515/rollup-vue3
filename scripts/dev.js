const execa = require('execa')

const target = 'reactivity'

async function build (target) {
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], { stdio: 'inherit' })
}

build(target)
