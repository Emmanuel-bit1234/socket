export interface DialogData {
  title: string;
  content: string;
  confirm: {
    confirm?: string;
    reject?: string;
  };
}
