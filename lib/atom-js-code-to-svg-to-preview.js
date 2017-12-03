"use babel";

import AtomJsCodeToSvgFlowchartView from "./atom-js-code-to-svg-to-preview-view";
import { CompositeDisposable } from "atom";
import * as js2flowchart from "js2flowchart";

export default {

  activate(state) {
    require("atom-package-deps").install("atom-js-code-to-svg-to-preview")
      .then(() => {
        console.log('All dependencies installed, good to go')
      })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "atom-js-code-to-svg-to-preview:toggle": () => this.toggle()
      })
    );

  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    let editor;
    if ((editor = atom.workspace.getActiveTextEditor())) {
      let selection = editor.getSelectedText();

      let svg = js2flowchart.convertCodeToSvg(selection);

      atom.workspace.open("selection.svg",{split: "right"})
      .then(editor => {
        editor.insertText(svg)
        atom.commands.dispatch(atom.workspace.getActivePane().element,"svg-preview:toggle");
      })
      .catch(err => console.log(err))
    }
  }
};
