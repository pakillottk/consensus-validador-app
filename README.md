# Consensus Validator
### Mobile APP for code validation using a consensus voting system

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

## Table of Contents
* [Overview](#overview) 
* [Scanning](#scanning)
* [The CONSENSUS vote system](#consensus-vote-system)

## Overview

This software is designed for robust code validation in a non ideal environment. It's tolerant to network failures (even working with any network at all, if using only 1-node/device) and iconsistent local state accross multiple devices.

In order to acheive that, implements a system where all the nodes (or devices connected) collaborate with each other to correct the possible state inconsistencies.

## Scanning

The APP allows scanning through an attached barcode scanner (via Bluetooth or integrated) or using the device's camera.

The codes will be stored in a local Database in the device. All the verification process will be against the data in the local database. Codes will come from an external API, which also implements the Voting API and helps to correct the nodes state.

## The CONSENSUS vote system

The goal of the system is to allow all nodes to correct each other if there are any connection problems.

In order for a code to be valid, it must be voted as valid by all the nodes of the network. In other words, all nodes must reach a `CONSENSUS` about the code.

When the device scans a code, it opens a votation process. This votation is broadcasted to all nodes in the network. Then, each node would cast it's vote to the voting API. When the votation ends, the result is broadcasted. If every vote says that the code is valid, the code is valid. Else, the code is not valid.

There's a special case when the code doesn't exist in a node. In that case, the node will be absent of the votation process. If every node absent, the code is not valid.

When a votation concludes, the result is broadcasted to the nodes to update their local state.

In case of network failure, the isolated device would act as a 1-node system where the voting API it's itself. On network recover, it would raise a votation for each code scanned in offline mode. Then, all nodes will get to the correct state and if some other node scan one of these codes while the system is recovering, it will fail (the previous offline node would cast a vote of not valid, therefore consensus won't be reached).

The only possible way of getting a duplicate validation it's obviously while 1-n of the nodes reamins isolated, but while the net it's functional the state differences doesn't matter.