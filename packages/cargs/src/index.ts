import yargs from 'yargs'

//@ts-ignore
const cargs: {
    data: string
    development?: boolean
    actor?: string
    actorId?: string
} = yargs.argv

export default cargs
