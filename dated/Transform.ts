class Vector {

    readonly x: number;
    readonly y: number;

    readonly length: number;
    readonly direction: number;

    /**
     * 2维向量或坐标。
     * 所有方法都会返回新对象，而不是改变原本的值。
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
        this.length = Vector.getLength(this);
        this.direction = Vector.getDirection(this);
    }

    add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    plus = this.add;

    subtract(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    minus = this.subtract;

    scale(s: Vector | number): Vector {
        if (typeof s == "number") {
            return new Vector(this.x * s, this.y * s);
        } else {
            return new Vector(this.x * s.x, this.y * s.y);
        }
    }

    multiply = this.scale;

    divide(s: Vector | number) {
        if (typeof s == "number") {
            return new Vector(this.x / s, this.y / s);
        } else {
            return new Vector(this.x / s.x, this.y / s.y);
        }
    }

    /**
     * 将该点绕 center 旋转 a 弧度。
     * @param theta 旋转的弧度值。
     * @param center 旋转中心，默认为坐标原点。
     * @returns 新的向量
     */
    rotate(theta: number, center?: Vector) {
        if (center === undefined) {
            let st = Math.sin(theta);
            let ct = Math.cos(theta);
            return new Vector(
                this.x * ct - this.y * st,
                this.x * st + this.y * ct
            );
        }
    }

    toString(): string {
        return `(${this.x},${this.y})`;
    }

    static getLength(v: Vector): number {
        return Math.sqrt(v.x ** 2 + v.y ** 2);
    }

    static getDirection(v: Vector): number {
        return Math.atan2(v.y, v.x);
    }
};



export class Transform {

    private _position: Vector;
    private _scale: Vector;
    private _direction: number;

    constructor(position = new Vector(), scale = new Vector(1, 1), direction = 0) {
        this._position = position;
        this._scale = scale;
        this._direction = direction;
    };

    get position(): Vector {
        return this._position
    }

    get x(): number {
        return this._position.x;
    }

    set x(v : number) {
        this.;
    }
    
    get y(): number {
        return this._position.y;
    }

    set y(v : number) {
        this.moveTo(undefined, v);
    }

    get scale(): Vector {
        return this._scale;
    }

    /** 横向缩放 */
    get sx(): number {
        return this._scale.x;
    }

    set sx(v: number) {
        this.scaleTo(new Vector(v, this.sy));
    }

    /** 缩放 */
    get s(): number {
        return this.sx
    }

    set s(v: Vector | number) {
        this.scaleTo(v);
    }

    /**  纵向缩放 */
    get sy(): number {
        return this._scale.y;
    }

    set sy(v: number) {
        this.scaleTo(new Vector(this.sx, v));
    }

    get direction(): number {
        return this._direction;
    }

    set direction(v: number) {
        this._direction = v;
    }

    /** 方向 */
    d = this.direction;

    /**
     * 移到一个绝对位置。可以接受一个向量，也可以接受两个坐标。留空的坐标表示不变。
     * @example
     * moveTo(vec) // 移到 vec 处
     * moveTo(20, 30) // 移到 (20, 30) 处
     * moveTo(undefined, 50) // 垂直于x轴移动到 y=50 处
     */
    moveTo(x?: Vector | number, y?: number): void {
        if (x instanceof Vector) {
            this._position = x;
        } else {
            this._position = new Vector(
                x == undefined ? this.x : x,
                y == undefined ? this.y : y
            );
        }
    }

    /**
     * 移动一个相对位置。可以接受一个向量，也可以接受两个坐标。留空的坐标表示不变。
     * @example
     * moveTo(vec) // 移动 vec
     * moveTo(20, 30) // 将 x 增加20，将 y 增加30
     * moveTo(y=50) // 将 y 增加50
     */
    moveBy(x?: Vector | number, y?: number): void {
        if (x instanceof Vector) {
            this._position = this._position.add(x);
        } else {
            this._position = this._position.add(new Vector(x, y));
        }
    }

    /**
     * 将缩放设为一个值。可以接受向量（横纵分别缩放）或倍数数值（横纵等比缩放）。
     * @example
     * scaleTo(new Vector(2, 0.5)) // 横向拉长到2倍，纵向压扁到一半
     * scaleTo(3) // 整体放大到3倍
     */
    scaleTo(s: Vector | number): void {
        if (typeof s == "number") {
            this._scale = new Vector(s, s);
        } else {
            this._scale = s;
        }
    }

    /**
     * 线性地增减缩放倍数。
     * @example
     * scaleA(new Vector(0, 2)) // 横向缩放不变，纵向缩放增加2
     * scaleA(2) // 横纵缩放各增加2
     */
    scaleAdd(s: Vector | number): void {
        if (typeof s == "number") {
            this._scale = this._scale.add(new Vector(s, s));
        } else {
            this._scale = this.scale.add(s);
        }
    }

    /**
     * 等比缩放。
     * @example
     * scaleM(new Vector(1, 2)) // 横向缩放不变，纵向拉长到之前的2倍
     * scaleM(2) // 整体缩放到之前的2倍
     */
    scaleMul(s: Vector | number): void {
        this._scale = this.scale.scale(s);
    }

    /** 旋转到指定角度，右侧为0， */
    rotateToAngle(angle: number): void {

    }
};