import * as zmq from "zeromq";
import { SmartcontractDeveloperRequest as MsgRequest } from "./message/smartcontract_developer_request";
import { Reply as MsgReply } from "./message/reply";
import * as Account from "./account";
import { ethers } from "ethers"

// Init returns the Gateway connected socket.
let init = async () : Promise<zmq.Request> => {
    let server_public_key = process.env.SDS_GATEWAY_PUBLIC_KEY!
    if (typeof server_public_key !== "string") {
        throw "missing 'SDS_GATEWAY_PUBLIC_KEY' environment variable";
    }
    if (server_public_key.length === 0) {
        throw "empty 'SDS_GATEWAY_PUBLIC_KEY' environment variable"
    }

    let public_key = process.env.SMARTCONTRACT_DEVELOPER_PUBLIC_KEY!
    if (typeof public_key !== "string") {
        throw "missing 'SMARTCONTRACT_DEVELOPER_PUBLIC_KEY' environment variable";
    }
    if (public_key.length === 0) {
        throw "empty 'SMARTCONTRACT_DEVELOPER_PUBLIC_KEY' environment variable"
    }

    let secret_key = process.env.SMARTCONTRACT_DEVELOPER_SECRET_KEY!
    if (typeof secret_key !== "string") {
        throw "missing 'SMARTCONTRACT_DEVELOPER_SECRET_KEY' environment variable";
    }
    if (secret_key.length === 0) {
        throw "empty 'SMARTCONTRACT_DEVELOPER_SECRET_KEY' environment variable"
    }

    let socket = new zmq.Request({
        linger: 0,
        curveServerKey: server_public_key,
        curvePublicKey: public_key,
        curveSecretKey: secret_key
    });

    let host = process.env.SDS_GATEWAY_HOST!
    if (typeof host !== "string") {
        throw "missing 'SDS_GATEWAY_HOST' environment variable";
    }
    if (host.length === 0) {
        throw "empty 'SDS_GATEWAY_HOST' environment variable"
    }

    let port = process.env.SDS_GATEWAY_PORT!
    if (typeof port !== "string") {
        throw "missing 'SDS_GATEWAY_PORT' environment variable";
    }
    if (port.length === 0) {
        throw "empty 'SDS_GATEWAY_PORT' environment variable"
    }

    try {
        socket.connect(`tcp://${host}:${port}`)
    } catch (error) {
        throw `error to connect to SDS Gateway. error message: ${error}`;
    }

    return socket
}

/// Returns a curve keypair that's used for the backend developers.
/// @param private_key is the smartcontract developer's account key
export let generate_key = async function(private_key: string): Promise<MsgReply> {
    let developer = new ethers.Wallet(private_key);

    let message = new MsgRequest('generate_key', {});
    message = await message.sign(developer);

    var gateway_reply = await request(message);
    if (!gateway_reply.is_ok()) {
        return gateway_reply;
    }

    var public_key = await Account.decrypt(developer, gateway_reply.params.public_key);
    var secret_key = await Account.decrypt(developer, gateway_reply.params.secret_key);

    gateway_reply.params.public_key = public_key.toString();
    gateway_reply.params.secret_key = secret_key.toString();

    return gateway_reply;
}

export let request = async function(msg: MsgRequest): Promise<MsgReply> {
    if (msg.address === undefined || msg.address === null) {
        return MsgReply.fail("Failed to do to a request. The request should be signed first", {})
    }
    let socket: zmq.Request;
    try {
        socket = await init();
    } catch (err) {
        return MsgReply.fail("Failed to init connection with SDS Gateway: "+ err.toString(), {});
    }

    try {
       await socket.send(msg.toString());
    } catch (err) {
        return MsgReply.fail("Failed to send message to SDS Gateway: "+ err.toString(), {});
    }

    var reply: MsgReply

    try {
        const [resultBuffer] = await socket.receive()
        reply = MsgReply.fromBuffer(resultBuffer);
    } catch (err) {
        reply = MsgReply.fail("Failed to receive message from SDS Gateway: "+ err.toString(), {});
    }

    socket.close()

    return reply
}