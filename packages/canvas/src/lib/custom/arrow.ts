import * as fabric from 'fabric';

const isFiller = (filler: fabric.TFiller | string | null): filler is fabric.TFiller => {
  return !!filler && (filler as fabric.TFiller).toLive !== undefined;
};

class FabricArrow extends fabric.Line {
  static type = 'arrow';

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);

    if (!this.width || !this.height || !this.visible) return;

    const xDiff = this.x2 - this.x1;
    const yDiff = this.y2 - this.y1;
    const angle = Math.atan2(yDiff, xDiff);

    ctx.save();
    ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
    ctx.rotate(angle);
    ctx.beginPath();

    ctx.moveTo(10, 0);
    ctx.lineTo(-20, 15);
    ctx.lineTo(-20, -15);
    ctx.closePath();

    if (isFiller(this.stroke)) {
      ctx.fillStyle = this.stroke.toLive(ctx)!;
    } else {
      ctx.fillStyle = this.stroke ?? ctx.fillStyle;
    }

    ctx.fill();
    ctx.restore();
  }
}

fabric.classRegistry.setClass(FabricArrow);
fabric.classRegistry.setSVGClass(FabricArrow);

FabricArrow.customProperties = ['name', 'id', 'erasable', 'evented', 'selectable'];

export { FabricArrow };
