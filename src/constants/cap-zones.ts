export type Zone = "front" | "mesh" | "brim" | "brimLining"

export const R2 = "https://pub-12950bec3a884d16a0d3965e30dc4e9f.r2.dev"

/**
 * Zone images per cap model.
 * Only include URLs for images that ACTUALLY EXIST on R2.
 * Missing zones are skipped during canvas compositing.
 */
export const ZONE_IMAGES: Record<string, Partial<Record<Zone, string>>> = {
    TRUCKER_TELA: {
        front: `${R2}/trucker-frontal.png`,
        mesh: `${R2}/trucker-tela.png`,
    },
    DAD_HAT: {
        front: `${R2}/dadhat-part-front.png`,
        mesh: `${R2}/dadhat-part-mesh.png`,
        brim: `${R2}/dadhat-part-brim.png`,
    },
    BASEBALL_6_PARTES: {
        front: `${R2}/americano-frontal.png`,
    },
}

export const ZONE_LABELS: Record<Zone, string> = {
    front: "Frente",
    mesh: "Tela / Lateral",
    brim: "Aba",
    brimLining: "Forro da Aba",
}
