export function useHighlight(selected, data) {
  if (!selected || !data) {
    return { hebergements: new Set(), bornes_eau: new Set(), bornes_elec: new Set() }
  }

  if (selected.type === 'hebergement') {
    const h = data.hebergements.find(x => x.id === selected.id)
    if (!h) return { hebergements: new Set(), bornes_eau: new Set(), bornes_elec: new Set() }
    return {
      hebergements: new Set([h.id]),
      bornes_eau:   h.borne_eau  ? new Set([h.borne_eau])  : new Set(),
      bornes_elec:  h.borne_elec ? new Set([h.borne_elec]) : new Set(),
    }
  }

  if (selected.type === 'borne_eau') {
    const borne = data.bornes_eau.find(b => b.id === selected.id)
    if (!borne) return { hebergements: new Set(), bornes_eau: new Set(), bornes_elec: new Set() }
    return {
      hebergements: new Set(borne.parcelles),
      bornes_eau:   new Set([borne.id]),
      bornes_elec:  new Set(),
    }
  }

  if (selected.type === 'borne_elec') {
    const borne = data.bornes_elec.find(b => b.id === selected.id)
    if (!borne) return { hebergements: new Set(), bornes_eau: new Set(), bornes_elec: new Set() }
    return {
      hebergements: new Set(borne.parcelles),
      bornes_eau:   new Set(),
      bornes_elec:  new Set([borne.id]),
    }
  }

  return { hebergements: new Set(), bornes_eau: new Set(), bornes_elec: new Set() }
}
