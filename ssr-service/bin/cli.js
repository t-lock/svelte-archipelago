#!/usr/bin/env node
import { createSvelteSSRService } from "../index.js";

const server = createSvelteSSRService();
server.start();
