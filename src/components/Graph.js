import React, { useState, useEffect } from 'react';
import {dfsFromNode} from 'graphology-traversal/dfs';
import _Graph from 'graphology';
import { scaleLinear } from 'd3-scale'
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

    function getGraphArgument() {
        let filter = control.filter.filter.field;
        return filter.replace(/(destination|departure)/g, (str) => {
            if (str === 'departure') {
                return 'destination'
            } else {
                return 'departure'
            }
        })
    }

    inputData = inputData
        .filter(row => row[control.year.filter.field] === control.year.filter.equal)
        // .filter(row => row[control.filter.filter.field] === control.filter.filter.equal)
        .map(({ tonnage, ...rest }) => {
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
    let minTonnage = Infinity, maxTonnage = 0;
    let minOccurence = Infinity, maxOccurence = 0;
    
    dfsFromNode(graph, 'Dunkerque', function (node, attr, depth) {
        nodesToKeep.add(node);
    });

    graph.forEachNode((node, { tonnage, occurence }) => {
        if (nodesToKeep.has(node) === false) {
            graph.dropNode(node);

            if (tonnage < minTonnage) { minTonnage = tonnage; }
            if (tonnage > maxTonnage) { maxTonnage = tonnage; }
    
            if (occurence < minOccurence) { minOccurence = occurence; }
            if (occurence > maxOccurence) { maxOccurence = occurence; }
        }
    })

    const scaleTonnage = scaleLinear(
        [minTonnage, maxTonnage],
        [1, 50]
    )

    const scaleOccurence = scaleLinear(
        [minOccurence, maxOccurence],
        [1, 50]
    )

    const graphologyExport = graph.export();
    const graphExport = {
        nodes: graphologyExport.nodes.map(({ key, attributes }, i) => {
            return {
                id: key,
                label: key,
                size: scaleOccurence(attributes.occurence),
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
    )
}