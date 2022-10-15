var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDatosPersonaje } from "../model/regciv.model.js";
export const httpGetDatosPersonaje = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nombresRecibidosArr = req.body;
    if (!(nombresRecibidosArr instanceof Array) || nombresRecibidosArr.length < 1) {
        return res.status(400).json({ error: "No array was given" });
    }
    const personajesArr = [];
    for (let i = 0; i < nombresRecibidosArr.length; i++) {
        if (nombresRecibidosArr[i] !== "") {
            const nombrePersonaje = nombresRecibidosArr[i];
            const datosPersonaje = yield getDatosPersonaje(nombrePersonaje);
            if (datosPersonaje !== null) {
                personajesArr.push(datosPersonaje);
            }
        }
    }
    console.log(personajesArr);
    return res.status(200).json(personajesArr);
});
