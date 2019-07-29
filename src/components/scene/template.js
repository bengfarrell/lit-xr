export default {
    html(params) {
        return `${this.style()}
                <canvas class="scene" touch-action="none"></canvas>`;
    },

    style() {
        return `<style>  
                      canvas.scene {
                        width: 100%;
                        height: 100%;
                        outline: none;   
                      }
                </style>`;
    }
}
