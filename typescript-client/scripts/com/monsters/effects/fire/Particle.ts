/**
 * Fire particle - individual particle for fire effect system.
 */
export class Particle {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public life: number;
    public clock: number;
    public next: Particle | null = null;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.life = 0;
        this.clock = Math.random() * Math.PI * 2;
    }
}
