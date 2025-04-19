/**
 * Custom loading spinner element
 * Creates a reusable, self-contained spinner component with shadow DOM
 * 
 * Usage:
 * <loader-custom></loader-custom>
 */
export class Loader extends HTMLElement {
    /**
     * Constructs the custom element and initializes shadow DOM
     */
    constructor() {
        super();

        // Create shadow root for component encapsulation
        this.attachShadow({ mode: 'open' });
        
        // Define component structure with inline styles
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

// Register the custom element in the browser
customElements.define('loader-custom', Loader);