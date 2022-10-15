var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
const baseUrl = "https://swapi.dev/api/people";
export const getDatosPersonaje = (nombrePersonaje) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(nombrePersonaje);
    const apiResponse = yield fetch(`${baseUrl}/${nombrePersonaje}`)
        .then(rawResponse => rawResponse.json())
        .catch(err => err);
    if (apiResponse instanceof Error || apiResponse["detail"]) {
        console.log(apiResponse);
        console.log("Personaje NO encontrado");
        return null;
    }
    return apiResponse;
});
