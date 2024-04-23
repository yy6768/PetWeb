// AnchorPanel.ts
export class AnchorPanel {
    private anchorData: any;

    constructor(anchorData: any) {
        this.anchorData = anchorData;
    }

    public show(): void {
        // 这里可以用原生的HTML/CSS来创建面板，或者如果你在Vue应用中使用，可以直接引用Vue组件
        console.log("Displaying anchor panel...");
        const panel = document.createElement('div');
        panel.style.position = 'absolute';
        panel.style.minWidth = '200px';
        panel.style.minHeight = '100px';
        panel.style.background = 'white';
        panel.style.border = '1px solid black';
        panel.style.padding = '10px';
        panel.innerHTML = `
            <h3>{this.anchorData.anchorDesc}</h3>
            <img src="{this.anchorData.imageUrl}" alt="Image" style="width: 100%;" />
            <video src="${this.anchorData.videoUrl}" controls style="width: 100%;"></video>
        `;
        document.body.appendChild(panel);
    }
}
