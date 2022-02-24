import React, { useState } from 'react';

export default function ControlBar({
    vizControl
}) {
    const [viz, setViz] = vizControl;
    return (
        <header style={{ marginBottom: 50 }}>
            <h1 className='title is-5'>Exploration des données Navigo pour le datasprint 2022</h1>
            <h2 className='subtitle is-6'>Sélectionnez les paramètres de la visualisation dans la colonne de gauche puis téléchargez-la en cliquant sur le trois points en haut à droite.</h2>

            <nav className="menu" role="navigation">
                <p className="menu-label">Visualisations</p>
                <ul className="menu-list" style={{ display: 'flex' }}>
                    {
                        ['matrice', 'histogramme', 'graphe'].map((vizName, i) => {
                            return (
                                <li key={i}>
                                    <a
                                    className={(viz === vizName) ? 'is-active' : null}
                                    onClick={() => setViz(vizName)}
                                    >
                                    {vizName}
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        </header>
    )
}