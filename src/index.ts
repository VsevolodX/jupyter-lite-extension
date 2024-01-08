import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';

const TARGET_URL = 'http://localhost:3001';

/**
 * Initialization data for the md-1 extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'md-1:plugin',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension md-1 is activated!');

    const commandID = 'md-1:send-material';
    app.commands.addCommand(commandID, {
      label: 'Send Material to Materials Designer',
      execute: () => {
        const material = { /* ... material data ... */ };
        console.log('Sending material to Materials Designer:', material);

        // Post a message to the parent window with material data
        window.parent.postMessage({ type: 'send-material', material }, TARGET_URL);
      }
    });

    // Add the command to the command palette
    palette.addItem({ command: commandID, category: 'Materials Designer' });

    // Listen for messages from the web app
    window.addEventListener('message', event => {
      // Check the origin for security during local development
      if (event.origin.startsWith('http://localhost')) {
        if (event.data && event.data.type === 'receive-material') {
          console.log('Material received from Materials Designer:', event.data.material);
          // Handle received material here
        }
      }
    });
  }
};

export default plugin;
