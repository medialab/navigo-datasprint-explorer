import React from 'react';

export default function Loader ({
    message
}) {
    return (
        <section className="hero">
            <div className="hero-body">
                <p className="title">
                    { message }
                </p>
            </div>
        </section>
    );
}