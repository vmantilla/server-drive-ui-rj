class SDCornerRadius {
    constructor(cornerRadius) {
        this.shape = cornerRadius.shape;
        this.corners = cornerRadius.corners;
    }

    get cornerRadiusValue() {
        let defaultRadius;
        switch (this.shape) {
            case "none":
                defaultRadius = 0;
                break;
            case "extraSmall":
                defaultRadius = 5;
                break;
            case "small":
                defaultRadius = 10;
                break;
            case "medium":
                defaultRadius = 20;
                break;
            case "large":
                defaultRadius = 30;
                break;
            case "extraLarge":
                defaultRadius = 40;
                break;
            case "full":
                defaultRadius = (this.frame?.height ?? 0) * 0.5;
                break;
            default:
                defaultRadius = 0;
                break;
        }

        return {
            topStart: this.corners.topStart ?? defaultRadius,
            topEnd: this.corners.topEnd ?? defaultRadius,
            bottomStart: this.corners.bottomStart ?? defaultRadius,
            bottomEnd: this.corners.bottomEnd ?? defaultRadius
        };
    }
}

export default SDCornerRadius;