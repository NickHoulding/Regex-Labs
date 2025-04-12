export class Modal {
    constructor() {
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'modal-backdrop';
        
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'modal';
        
        this.iconContainer = document.createElement('div');
        this.iconContainer.className = 'modal-icon-container';

        this.header = document.createElement('div');
        this.header.className = 'modal-header';
        
        this.title = document.createElement('h2');
        this.header.appendChild(this.title);
        
        this.body = document.createElement('div');
        this.body.className = 'modal-body';
        
        this.message = document.createElement('p');
        this.body.appendChild(this.message);
        
        this.footer = document.createElement('div');
        this.footer.className = 'modal-footer';
        
        this.cancelBtn = document.createElement('button');
        this.cancelBtn.className = 'modal-cancel-btn';
        this.cancelBtn.textContent = 'Cancel';
        this.cancelBtn.addEventListener('click', () => this.close());
        this.footer.appendChild(this.cancelBtn);
        
        this.confirmBtn = document.createElement('button');
        this.confirmBtn.className = 'modal-confirm-btn';
        this.confirmBtn.textContent = 'Confirm';
        this.footer.appendChild(this.confirmBtn);
        
        this.modalElement.appendChild(this.iconContainer); // Add icon container to modal
        this.modalElement.appendChild(this.header);
        this.modalElement.appendChild(this.body);
        this.modalElement.appendChild(this.footer);
        this.backdrop.appendChild(this.modalElement);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        this.isOpen = false;
    }
    
    show(options) {
        this.title.textContent = options.title || 'Confirm';
        this.message.textContent = options.message || 'Are you sure?';
        
        // Add support for custom modal types (warning, info, etc.)
        this.modalElement.className = 'modal';
        if (options.type) {
            this.modalElement.classList.add(`modal-${options.type}`);
        }
        
        // Handle icon
        this.iconContainer.innerHTML = '';
        this.iconContainer.style.display = 'none';
        if (options.icon) {
            this.iconContainer.innerHTML = options.icon;
            this.iconContainer.style.display = 'flex';
        }
        
        if (this.confirmHandler) {
            this.confirmBtn.removeEventListener('click', this.confirmHandler);
        }
        
        this.confirmHandler = () => {
            if (options.onConfirm) {
                options.onConfirm();
            }
            this.close();
        };
        
        this.confirmBtn.addEventListener('click', this.confirmHandler);
        this.confirmBtn.textContent = options.confirmText || 'Confirm';
        this.cancelBtn.textContent = options.cancelText || 'Cancel';
        
        // Control button visibility
        this.confirmBtn.style.display = options.hideConfirm ? 'none' : 'inline-block';
        this.cancelBtn.style.display = options.hideCancel ? 'none' : 'inline-block';
        
        // Add class to control footer alignment based on visible buttons
        if (options.hideConfirm || options.hideCancel) {
            this.footer.classList.add('single-button');
        } else {
            this.footer.classList.remove('single-button');
        }
        
        document.body.appendChild(this.backdrop);
        this.isOpen = true;
        
        // Always make modals blocking - remove non-blocking option
        this.backdrop.classList.remove('non-blocking');
        
        setTimeout(() => {
            this.backdrop.classList.add('visible');
        }, 10);
    }
    
    close() {
        this.backdrop.classList.remove('visible');
        
        setTimeout(() => {
            if (this.backdrop.parentNode) {
                document.body.removeChild(this.backdrop);
            }
            this.isOpen = false;
        }, 300);
    }
    
    showWarning(message, title = 'Warning') {
        const warningIcon = `<svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10.9085 2.78216C11.9483 2.20625 13.2463 2.54089 13.8841 3.5224L13.9669 3.66023L21.7259 17.6685C21.9107 18.0021 22.0076 18.3773 22.0076 18.7587C22.0076 19.9495 21.0825 20.9243 19.9117 21.0035L19.7576 21.0087H4.24187C3.86056 21.0087 3.4855 20.9118 3.15192 20.7271C2.11208 20.1513 1.70704 18.8734 2.20059 17.812L2.27349 17.6687L10.0303 3.66046C10.2348 3.2911 10.5391 2.98674 10.9085 2.78216ZM12.0004 16.0018C11.4489 16.0018 11.0018 16.4489 11.0018 17.0004C11.0018 17.552 11.4489 17.9991 12.0004 17.9991C12.552 17.9991 12.9991 17.552 12.9991 17.0004C12.9991 16.4489 12.552 16.0018 12.0004 16.0018ZM11.9983 7.99806C11.4854 7.99825 11.0629 8.38444 11.0053 8.8818L10.9986 8.99842L11.0004 13.9993L11.0072 14.1159C11.0652 14.6132 11.488 14.9991 12.0008 14.9989C12.5136 14.9988 12.9362 14.6126 12.9938 14.1152L13.0004 13.9986L12.9986 8.9977L12.9919 8.88108C12.9339 8.38376 12.5111 7.99788 11.9983 7.99806Z"/></svg>`;
        
        this.show({
            title: title,
            message: message,
            type: 'warning',
            icon: warningIcon,
            confirmText: 'Dismiss',
            hideConfirm: true,
            hideCancel: false,
            cancelText: 'Dismiss'
        });
    }
    
    showReset(message, onReset, title = 'Reset') {
        const resetIcon = `<svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 11.7144 4.76652 11.4326 4.79864 11.1556C4.86674 10.5685 4.44068 10 3.8496 10C3.33398 10 2.88069 10.3581 2.81834 10.8699C2.77322 11.2403 2.75 11.6174 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75C9.82686 2.75 7.82875 3.49939 6.25 4.75385V4.25C6.25 3.69772 5.80228 3.25 5.25 3.25C4.69772 3.25 4.25 3.69772 4.25 4.25V6.94829C4.23877 6.96549 4.22759 6.98272 4.21647 7H4.25V7.25C4.25 7.80228 4.69772 8.25 5.25 8.25H8.25C8.80228 8.25 9.25 7.80228 9.25 7.25C9.25 6.69772 8.80228 6.25 8.25 6.25H7.58352C8.80642 5.30932 10.3379 4.75 12 4.75Z"/></svg>`;
        
        this.show({
            title: title,
            message: message,
            type: 'reset',
            icon: resetIcon,
            confirmText: 'Reset',
            hideConfirm: false,
            hideCancel: false,
            cancelText: 'Cancel',
            onConfirm: onReset
        });
    }
}
