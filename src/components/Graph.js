import React, { useState, useEffect } from 'react';
import _Graph from 'graphology';
import Graph from 'react-vis-network-graph';

import 'vis-network/dist/dist/vis-network.min.css';

const graph = new _Graph();

export default function GraphViz({
    data: inputData,
    control
}) {
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
        .filter(row => row[control.action.filter.field] === control.action.filter.equal)
        .filter(row => row[control.filter.filter.field] === control.filter.filter.equal)
        .map(({ tonnage, ...rest }) => {
            return {
                tonnage: Number(tonnage),
                aggregation: 1,
                ...rest
            }
        })

    const directionField = control.filter.filter.field;
    const direction = control.filter.filter.equal;
    const directionOppositeField = getGraphArgument();
    const directionOppositeList = inputData.map(row => row[directionOppositeField]);

    for (let i = 0; i < inputData.length; i++) {
        const row = inputData[i];
        const nodeName = row[directionOppositeField];
        if (graph.hasNode(nodeName)) {
            graph.updateNodeAttributes(nodeName, attr => {
                return {
                    ...attr,
                    tonnage: attr.tonnage + row['tonnage'],
                    aggregation: attr.aggregation + 1
                }
            })
            continue;
        }
        graph.addNode(nodeName, { ...row });
    }

    graph.forEachNode((node, attr) => {
        if (
            directionOppositeList.includes(attr[directionField]) ||
            directionOppositeList.includes(attr[directionOppositeField])
        ) {
            if (
                graph.hasNode(attr[directionField]) &&
                graph.hasNode(attr[directionOppositeField])
            ) {
                if (graph.hasEdge(attr[directionField], attr[directionOppositeField])) {
                    graph.updateEdgeAttribute(
                        attr[directionField], attr[directionOppositeField],
                        'aggregation',
                        n => n + 1
                    )
                } else {
                    graph.addEdge(attr[directionField], attr[directionOppositeField], {
                        aggregation: 1
                    })
                }
            }
        }
    })

    const graphologyExport = graph.export();
    const graphExport = {
        nodes: graphologyExport.nodes.map(({ key, attributes }, i) => {
            return {
                id: key,
                label: key,
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
                        centralGravity: 0.01,
                        springConstant: 0.08,
                        springLength: 100,
                        damping: 0.4,
                        avoidOverlap: 0
                    },
                    repulsion: {
                        centralGravity: 0.2,
                        springLength: 200,
                        springConstant: 0.05,
                        nodeDistance: 100,
                        damping: 0.09
                    }
                }
            }}
        />
    )
}