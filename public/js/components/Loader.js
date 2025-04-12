export class Loader extends HTMLElement {
    // Construct the custom element.
    constructor() {
        super();

        // Create shadow root and define element structure.
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .loader {
                    width: 1em;
                    height: 1em;
                    border: 3px solid #1A1A1A;
                    border-top: 3px solid #FFFFFF;
                    border-radius: 50%;
                    animation: spin 0.9s ease infinite;
                    transition: border 0.3s ease, border-top 0.3s ease;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="loader"></div>
        `;
    }
}

// Define the custom element.
customElements.define('loader-custom', Loader);