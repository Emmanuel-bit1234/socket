export interface DialogData {
    title: string;
    content?: string;
    label?: string;
    confirm: {
      confirm?: string;
      reject?: string;
    };
  }