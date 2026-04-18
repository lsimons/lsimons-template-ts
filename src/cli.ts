#!/usr/bin/env node
import { greet } from "./greet.ts";

function main(argv: string[]): number {
    const name = argv[2] ?? "world";
    process.stdout.write(`${greet(name)}\n`);
    return 0;
}

process.exit(main(process.argv));
