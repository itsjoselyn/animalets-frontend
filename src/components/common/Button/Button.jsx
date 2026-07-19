import React from 'react';

export default function Button({
    children,
    variant,             // Mapea las clases CSS preexistentes de tu web
    active = false,      // Controla los modificadores '--active' (dots, testimonios, sort)
    isOpen = false,      // Controla el estado del acordeón para accesibilidad
    type = 'button',
    disabled = false,
    onClick,
    className = '',      // Permite inyectar clases extra manuales si fuera necesario
    ...props             // Captura styles inline (position absolute, etc.) y aria-labels
}) {

    // Diccionario de variantes exactas que usas en tu ecosistema CSS
    const variantClasses = {
        'menu': 'nav-menu-btn',
        'dot': `amission-dot${active ? ' amission-dot--active' : ''}`,
        'more-blog': 'blog-grid-more-btn',
        'more-cat': 'cat-grid-more-btn',
        'submit': 'cform-submit',
        'close-modal': 'cform-privacy-modal-close',
        'close-toast': 'cform-toast-close',
        'carousel-arrow-left': 'cat-carousel-arrow cat-carousel-arrow--left',
        'carousel-arrow-right': 'cat-carousel-arrow cat-carousel-arrow--right',
        'testi-node': `testi-node${active ? ' testi-node--active' : ''}`,
        'accordion': 'cayudar-item-header',
        'img-arrow-left': 'pcat-img-arrow pcat-img-arrow--left',
        'img-arrow-right': 'pcat-img-arrow pcat-img-arrow--right',
        'filters-close': 'pfilters-close',
        'filters-reset': 'pfilters-btn pfilters-btn--reset',
        'filters-apply': 'pfilters-btn pfilters-btn--apply',
        'peludos-action': 'peludos-action-btn',
        'sort-option': `psort-option${active ? ' psort-option--active' : ''}`,
        'close-profile': 'catprofile-close',
        'close-testi-page': 'testpage-close',
        'admin-btn': 'cayudar-btn' // El botón base del panel de control
    };

    // Obtener la clase base según el mapa o dejar vacío si es transparente/sin clase específica
    const computedClass = variantClasses[variant] || '';

    // Combinar clase del mapa con cualquier className adicional enviado por prop
    const finalClasses = [computedClass, className].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={finalClasses || undefined}
            onClick={onClick}
            disabled={disabled}
            aria-expanded={variant === 'accordion' ? isOpen : undefined}
            {...props}
        >
            {children}
        </button>
    );
}