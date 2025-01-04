import * as fabric from 'fabric';

declare module 'fabric' {
  interface FabricObject {
    id: string;
    name?: string;
  }

  interface SerializedObjectProps {
    id: string;
    name?: string;
  }
}

export function setupFabric() {
  const middleControlVertical = document.createElement('img');
  middleControlVertical.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAxMiAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjE2IiByeD0iMiIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNC4yNSIgeT0iNC4yNSIgd2lkdGg9IjMuNSIgaGVpZ2h0PSIxNS41IiByeD0iMS43NSIgc3Ryb2tlPSIjMjU2M0VCIiBzdHJva2Utb3BhY2l0eT0iMSIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L2c+Cjwvc3ZnPgo=';

  const middleControlHorizontal = document.createElement('img');
  middleControlHorizontal.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyNCAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgPgo8cmVjdCB4PSIyMCIgeT0iNCIgd2lkdGg9IjQiIGhlaWdodD0iMTYiIHJ4PSIyIiB0cmFuc2Zvcm09InJvdGF0ZSg5MCAyMCA0KSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTkuNzUiIHk9IjQuMjUiIHdpZHRoPSIzLjUiIGhlaWdodD0iMTUuNSIgcng9IjEuNzUiIHRyYW5zZm9ybT0icm90YXRlKDkwIDE5Ljc1IDQuMjUpIiBzdHJva2U9IiMyNTYzRUIiIHN0cm9rZS1vcGFjaXR5PSIxIiBzdHJva2Utd2lkdGg9IjEiIC8+CjwvZz4KPC9zdmc+Cg==';

  const edgeControl = document.createElement('img');
  edgeControl.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOSAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgPgo8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iNC41IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iNC4yNSIgc3Ryb2tlPSIjMjU2M0VCIiBzdHJva2Utb3BhY2l0eT0iMSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjwvZz4KPC9zdmc+Cg==';

  const rotationControl = document.createElement('img');
  rotationControl.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgPgo8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iNSIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjQuNzUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjQiIHN0cm9rZS13aWR0aD0iMC41Ii8+CjwvZz4KPHBhdGggZD0iTTEwLjgwNDcgMTEuMTI0Mkw5LjQ5OTM0IDExLjEyNDJMOS40OTkzNCA5LjgxODg1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik02Ljk0ODU2IDYuNzI2MDdMOC4yNTM5MSA2LjcyNjA3TDguMjUzOTEgOC4wMzE0MiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOS42OTUxNyA2LjkyMjY3QzEwLjAwNyA3LjAzMzAxIDEwLjI4NTggNy4yMjA1NCAxMC41MDU1IDcuNDY3NzZDMTAuNzI1MiA3LjcxNDk3IDEwLjg3ODcgOC4wMTM4MiAxMC45NTE3IDguMzM2NDJDMTEuMDI0NyA4LjY1OTAyIDExLjAxNDggOC45OTQ4NSAxMC45MjI5IDkuMzEyNThDMTAuODMxIDkuNjMwMzEgMTAuNjYwMSA5LjkxOTU4IDEwLjQyNjIgMTAuMTUzNEw5LjQ5NzAxIDExLjA0MjFNOC4yNTc5MiA2LjcyNjA3TDcuMzA5MzcgNy43MzU1NEM3LjA3NTQzIDcuOTY5MzYgNi45MDQ1NCA4LjI1ODYzIDYuODEyNjQgOC41NzYzNkM2LjcyMDczIDguODk0MDggNi43MTA4MSA5LjIyOTkyIDYuNzgzODEgOS41NTI1MUM2Ljg1NjggOS44NzUxMSA3LjAxMDMyIDEwLjE3NCA3LjIzMDA1IDEwLjQyMTJDNy40NDk3OCAxMC42Njg0IDcuNzI4NTUgMTAuODU1OSA4LjA0MDM2IDEwLjk2NjMiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==';

  const dragControl = document.createElement('img');
  dragControl.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSI1IiBmaWxsPSJ3aGl0ZSIvPgogICAgPGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjQuNzUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjQiIHN0cm9rZS13aWR0aD0iMC41Ii8+CiAgPC9nPgogIDxwYXRoIGQ9Ik05IDkgTDkgNi41IE05IDYuNSBMOC41IDcgTTkgNi41IEw5LjUgNyBNOSA5IEw5IDExLjUgTTkgMTEuNSBMOC41IDExIE05IDExLjUgTDkuNSAxMSBNOSA5IEw2LjUgOSBNNi41IDkgTDcgOC41IE02LjUgOSBMNyA5LjUgTTkgOSBMMTEuNSA5IE0xMS41IDkgTDExIDguNSBNMTEuNSA5IEwxMSA5LjUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';

  function renderIconVertical(ctx: CanvasRenderingContext2D, left: number, top: number, _: unknown, fabricObject: fabric.FabricObject) {
    const wsize = 20;
    const hsize = 25;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(middleControlVertical, -wsize / 2, -hsize / 2, wsize, hsize);
    ctx.restore();
  }

  function renderIconHorizontal(ctx: CanvasRenderingContext2D, left: number, top: number, _: unknown, fabricObject: fabric.FabricObject) {
    const wsize = 25;
    const hsize = 20;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(middleControlHorizontal, -wsize / 2, -hsize / 2, wsize, hsize);
    ctx.restore();
  }

  function renderIconEdge(ctx: CanvasRenderingContext2D, left: number, top: number, _: unknown, fabricObject: fabric.FabricObject) {
    const wsize = 25;
    const hsize = 25;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(edgeControl, -wsize / 2, -hsize / 2, wsize, hsize);
    ctx.restore();
  }

  function renderIconRotate(ctx: CanvasRenderingContext2D, left: number, top: number, _: unknown, fabricObject: fabric.FabricObject) {
    const wsize = 40;
    const hsize = 40;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(rotationControl, -wsize / 2, -hsize / 2, wsize, hsize);
    ctx.restore();
  }

  function renderIconDrag(ctx: CanvasRenderingContext2D, left: number, top: number, _: unknown, fabricObject: fabric.FabricObject) {
    const wsize = 40;
    const hsize = 40;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(dragControl, -wsize / 2, -hsize / 2, wsize, hsize);
    ctx.restore();
  }

  fabric.InteractiveFabricObject.ownDefaults = {
    ...fabric.InteractiveFabricObject.ownDefaults,

    transparentCorners: false,
    borderColor: '#2563EB',
    cornerColor: '#FFFFFF',
    borderScaleFactor: 2,
    paintFirst: 'stroke',
    cornerStyle: 'circle',
    cornerStrokeColor: '#2563EB',
    borderOpacityWhenMoving: 0.8,
    strokeUniform: true,
    objectCaching: false,

    controls: {
      ...fabric.InteractiveFabricObject.ownDefaults.controls,

      ml: new fabric.Control({
        x: -0.5,
        y: 0,
        offsetX: -1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
        render: renderIconVertical,
      }),

      mr: new fabric.Control({
        x: 0.5,
        y: 0,
        offsetX: 1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
        render: renderIconVertical,
      }),

      mb: new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
        render: renderIconHorizontal,
      }),

      mt: new fabric.Control({
        x: 0,
        y: -0.5,
        offsetY: -1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
        render: renderIconHorizontal,
      }),

      tl: new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: renderIconEdge,
      }),

      tr: new fabric.Control({
        x: 0.5,
        y: -0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: renderIconEdge,
      }),

      bl: new fabric.Control({
        x: -0.5,
        y: 0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: renderIconEdge,
      }),

      br: new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: renderIconEdge,
      }),

      mtr: new fabric.Control({
        x: 0,
        y: 0.5,
        cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        offsetY: 28,
        offsetX: 20,
        withConnection: false,
        actionName: 'rotate',
        render: renderIconRotate,
      }),

      mbr: new fabric.Control({
        x: 0,
        y: 0.5,
        cursorStyleHandler: (_e, _c, object) => {
          if (object.lockMovementX && object.lockMovementY) return 'not-allowed';
          else if (!object.lockScalingX && object.lockMovementY) return 'ew-resize';
          else if (object.lockScalingX && !object.lockMovementY) return 'ns-resize';
          else return 'all-scroll';
        },
        actionHandler: fabric.controlsUtils.dragHandler,
        offsetY: 28,
        offsetX: -20,
        withConnection: false,
        actionName: 'drag',
        render: renderIconDrag,
      }),
    },
  };

  fabric.FabricObject.customProperties = ['name', 'id'];
}
