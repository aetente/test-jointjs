export const cells = {

    cells: [
      {
        attrs: {
          label: {
            text: "DonKey"
          },
          text: {text: "DonKey"},
          '.': { magnet: false }
        },
        size: { width: 100, height: 100 },
        inPorts: ['in'],
        outPorts: ['out'],
        typeOfCell: "root"
      },
      {
        attrs: {
          label: {
            text: "COIN"
          },
          '.': { magnet: false }
        },
        size: { width: 100, height: 50 },
        inPorts: ['in'],
        outPorts: ['out'],
        typeOfCell: "base_token"
      },
    ]
  };
  

export const earnCell = {
    attrs: {
      label: {
        text: "default text"
      },
      '.': { magnet: false }
    },
    size: { width: 100, height: 50 },
    inPorts: ['in'],
    outPorts: ['out']
  }