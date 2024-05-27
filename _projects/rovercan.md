---
title: "RoverCAN"
tags:
  - Embedded
  - C++
header:
  teaser: /assets/images/rover/board-stack.jpg
---

RoverCAN was designed to send and receive data over the CAN bus (used in the rover to connect all custom PCBs).

### Basic Idea:

- We want to be able to send data from any CAN device (Jetson, any of the boards) to any other CAN device
- This data is in the form of a struct that both devices know the structure and size of
- This struct is then
    - serialized (converted to a stream/array of bytes)
    - fragmented (CAN allows for 8 bytes per data frame, we might want to send more than 8 bytes)
    - sent (transmitted over the physical CAN bus)

### Less Basic Idea:

- 29 bit CAN Arbitration ID is broken up into Sendpoint (sp, 8 bits), Endpoint (ep, 8 bits), and Sequence number (seq_num, 13 bits)
- Structs are sent from Sendpoint to Endpoint
    - Sendpoints are used to identify the sender of a struct. Some examples:
        - Jetson
        - Drive Board
        - Arm Board
    - Endpoints are used to identify where the sender wants the data to end up. Some examples:
        - Drive command
        - Battery cell voltages
- Nodes are very similar to ROS nodes
    - Have an identity field of type Sendpoint
    - Listen (similar to subscribe) listens to Structs received on particular Endpoint
        - listen(Endpoint ep)
        - In the background, the listen method creates a mailbox for structs received on the given endpoint so that they can be obtained when they're received.
    - Send (similar to publish) sends Structs to a particular Endpoint from the Node’s identity Sendpoint
        - send(Endpoint ep, Struct data)

### How listen() works

- Whenever a CAN data frame is received, it is converted to a StructFragment
    - StructFragments are just like data frames, but the bitfields of the arbitration ID are separated into individual fields
- RoverCAN Nodes have a map of data structures called Bins, which are simply containers that you put StructFragments into
- Bins correspond to one specific Endpoint, and each Endpoint has a specific type of Struct that all CAN devices know how to decode.
- Bins are comprised of Sub bins that each contain StructFragments with the same Sendpoint
- When a Sub bin is full, the contents are defragmented, deserialized, and then a Struct is reconstructed from the binary data. Then, the Struct is put in the Mailbox where the user can grab it whenever they want.

### How send() works

- Send simply serializes the Struct and loops through the bytes, constructing a new StructFragment every 8 bytes, filling in the fields as it goes, then converts the StructFragment to a CAN data frame and sends it over the wire.
