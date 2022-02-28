import React, { useState, useEffect } from 'react';
import {dfsFromNode} from 'graphology-traversal/dfs';
import _Graph from 'graphology';
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { schemePaired } from 'd3-scale-chromatic'
import Graph from 'react-vis-network-graph';

import 'vis-network/dist/dist/vis-network.min.css';

export default function GraphViz({
    data: inputData,
    control
}) {
    const graph = new _Graph();
    
    for (const key in control) {
        if (typeof control[key] !== 'string') {
            continue;
        }

        try {
            control[key] = JSON.parse(control[key]);
        } catch (error) {

        }
    }

    inputData = inputData
        .filter(row => row[control.year.filter.field] === control.year.filter.equal)
        .map(({ tonnage, occurence, ...rest }) => {
            return {
                tonnage: Number(tonnage),
                occurence: 1,
                ...rest
            }
        })

    for (const row of inputData) {
        ['departure', 'destination'].forEach(direction => {
            let nodeName = row[direction];

            if (graph.hasNode(nodeName)) {
                graph.updateNodeAttributes(nodeName, attr => {
                    return {
                        ...attr,
                        tonnage: attr.tonnage + row['tonnage'],
                        occurence: attr.occurence + 1
                    }
                })
            } else {
                graph.addNode(nodeName, { ...row });
            }
        })
    }

    graph.forEachNode((node, attrs) => {
        if (
            graph.hasNode(attrs['departure']) &&
            graph.hasNode(attrs['destination'])
        ) {
            if (graph.hasEdge(attrs['departure'], attrs['destination'])) {
                graph.updateEdgeAttribute(
                    attrs['departure'], attrs['destination'],
                    'occurence',
                    n => n + 1
                )
            } else {
                graph.addEdge(attrs['departure'], attrs['destination'], {
                    occurence: 1
                })
            }
        }
    })

    if (graph.hasNode('Dunkerque') === false) {
        return null;
    }

    const nodesToKeep = new Set();
    const xValues = new Set();
    let minTonnage = Infinity, maxTonnage = 0;
    let minOccurence = Infinity, maxOccurence = 0;
    
    dfsFromNode(graph, 'Dunkerque', function (node, attr, depth) {
        nodesToKeep.add(node);
    }, {
        mode: 'directed'
    });

    graph.forEachNode((node, { tonnage, occurence, ...rest }) => {
        if (nodesToKeep.has(node) === false) {
            graph.dropNode(node);

        } else {
            xValues.add(rest[control.y.field])

            if (tonnage < minTonnage) { minTonnage = tonnage; }
            if (tonnage > maxTonnage) { maxTonnage = tonnage; }
    
            if (occurence < minOccurence) { minOccurence = occurence; }
            if (occurence > maxOccurence) { maxOccurence = occurence; }
        }
    })

    if (control.y.field === undefined || control.aggregate.field === undefined) {
        return null;
    }

    let setSize;
    switch (control.aggregate.field) {
        case 'tonnage':
            setSize = scaleLinear(
                [minTonnage, maxTonnage],
                [5, 25]
            )
            break;

        case 'occurence':
            setSize = scaleLinear(
                [minOccurence, maxOccurence],
                [5, 25]
            )
            break;
    }

    let setColor;
    switch (control.y.field) {
        case 'homeport':
            setColor = scaleOrdinal()
                .domain(Array.from(xValues))
                .range(schemePaired);
            break;

        case 'homeport_state_1789_fr':
            setColor = scaleOrdinal()
                .domain(Array.from(xValues))
                .range(schemePaired);
            break;

        case 'tonnage_class':
            setColor = scaleOrdinal()
                .domain([
                    '[1-20]',
                    '[21-50]',
                    '[51-100]',
                    '[101-200]',
                    '[201-500]',
                ])
                .range([
                    'hsl(24, 95%, 20%)',
                    'hsl(24, 95%, 35%)',
                    'hsl(24, 95%, 50%)',
                    'hsl(24, 95%, 65%)',
                    'hsl(24, 95%, 80%)'
                ]);
            break;
    }

    const graphologyExport = graph.export();
    const graphExport = {
        nodes: graphologyExport.nodes.map(({ key, attributes }, i) => {
            return {
                id: key,
                label: key,
                size: setSize(attributes[control.aggregate.field]),
                color: setColor(attributes[control.y.field]),
                ...attributes
            }
        }),
        edges: graphologyExport.edges.map(({ key, source, target, attributes }) => {
            return {
                id: key,
                from: source,
                to: target,
                ...attributes
            }
        })
    }

    return (
        <>
            <ul>
                {
                    Array.from(xValues).map((color, i) => {
                        return <li
                            style={{
                                color: setColor(color),
                                fontWeight: 'bold'
                            }}
                            key={i}
                        >{color}</li>
                    })
                }
            </ul>
            <Graph
                graph={graphExport}
                options={{
                    height: '800px',
                    nodes: {
                        size: 5,
                        shape: 'dot'
                    },
                    physics: {
                        enabled: true,
                        forceAtlas2Based: {
                            theta: 0.5,
                            gravitationalConstant: -50,
                            centralGravity: 10,
                            springConstant: 0.08,
                            springLength: 100,
                            damping: 0.4,
                            avoidOverlap: 0
                        },
                        hierarchicalRepulsion: {
                            centralGravity: 0.0,
                            springLength: 100,
                            springConstant: 0.01,
                            nodeDistance: 120,
                            damping: 0.09,
                            avoidOverlap: 0
                        },
                        stabilization: {
                            enabled: true,
                            iterations: 1000,
                            updateInterval: 200,
                            onlyDynamicEdges: false,
                            fit: true
                        }
                    }
                }}
            />
        </>
    )
}