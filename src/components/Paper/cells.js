export const cells = {

    cells: [
      {
        attrs: {
          label: {
            text: "DonKey",
            fontFamily: 'Poppins, sans-serif'
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
            text: "COIN",
            fontFamily: 'Poppins, sans-serif'
          },
          text: {
            fontFamily: 'Poppins, sans-serif'
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
        text: "default text",
        fill: "#777E90",
        fontFamily: 'Poppins, sans-serif'
      },
      body: {
        rx: 8,
        ry: 8,
        fill: "#F9FAFB",
        stroke: "#777E90"
      },
      text: {
        fontFamily: 'Poppins, sans-serif'
      },
      '.': { magnet: false }
    },
    size: { width: 120, height: 43 },
    inPorts: ['in'],
    outPorts: ['out']
  }

  export const frameCell = {
    attrs: {
      body: {
        fill: "rgba(0,0,0,0)",
        stroke: "#777E90"
      },
      '.': { magnet: false }
    },
    size: { width: 918, height: 532 },
    typeOfCell: "frame"
  }

  export const frameHorizantalLine = {
    attrs: {
      body: {
        fill: "rgba(0,0,0,0)",
        stroke: "#777E90"
      },
      '.': { magnet: false }
    },
    size: { width: 918, height: 1 },
    typeOfCell: "frame"
  }
  
  export const frameVerticalLine = {
    attrs: {
      body: {
        fill: "rgba(0,0,0,0)",
        stroke: "#777E90"
      },
      '.': { magnet: false }
    },
    size: { width: 1, height: 532 },
    typeOfCell: "frame"
  }