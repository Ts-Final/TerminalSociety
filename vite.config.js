import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var command = _a.command, mode = _a.mode;
    if (command == 'serve') {
        return {
            plugins: [vue()],
            base: "/",
        };
    }
    else if (command == "build") {
        return {
            plugins: [vue()],
            base: "https://ts-final.github.io/TerminalSociety"
        };
    }
});
