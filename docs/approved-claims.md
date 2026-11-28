# Approved claims library

The wording the website may use for each product line, and where each claim comes from.
`tests/claims.test.js` blocks the disallowed kinds of claims listed at the end.
Final wording is subject to sign-off by a regulatory consultant.

Sources:
- **EPA label**: Sani-TEST, EPA Reg. No. 97801-1, master label accepted 7/29/2022 (notification
  6/21/2023): https://www3.epa.gov/pesticides/chem_search/ppls/097801-00001-20220729.pdf
  OHS distributor product: EPA Reg. No. 97801-1-105539.
- **Change Request Part G** (Brandon's compliance rules).

The EPA registration notice says website claims may not substantially differ from the
registration (FIFRA 12(a)(1)(B)); the website can be referred to EPA enforcement.

---

## EPA Premium line (the two EPA-registered products; Utah only)

### Efficacy (hard, non-porous surfaces, 10-minute wet contact time)
| Approved wording | Source |
|---|---|
| EPA-registered disinfectant · Hospital disinfectant · Broad-spectrum (hospital) disinfectant | EPA label, optional marketing statements |
| Kills 99.9% of bacteria and viruses [on hard, non-porous surfaces] [in 10 minutes] | EPA label, disinfecting claims |
| Kills 99.999% of Human Coronavirus | EPA label |
| Kills Staphylococcus aureus, Pseudomonas aeruginosa, and Human Coronavirus | EPA label, organism table (10 min each) |
| Kills 99.9% of germs · Nature's Germ Killer · Bactericidal · Virucidal | EPA label |
| 3-in-1 Disinfectant / Cleaner / Deodorizer · One-step cleaner and disinfectant | EPA label |
| Kills odor-causing bacteria · Eliminates odors at their source · Eliminates pet odors | EPA label |
| Cleans mold and mildew stains (cleaning, not killing) | EPA label, cleaning directions |
| Allow surfaces to remain visibly wet for 10 minutes | EPA label, directions |

### Use sites (examples from the label; always "hard, non-porous surfaces")
Hospital, medical and dental office, day care, nursery, school, office, restaurant, kitchen,
food contact surfaces (no rinse needed), food and beverage processing equipment, meat and
poultry plants and dairies (per label directions), pet living areas and kennels, agricultural
facilities and equipment, poultry / bovine / equine / swine facilities, gyms.

### Mildness and handling (use instead of "safe" / "non-toxic")
| Approved wording | Source |
|---|---|
| Contains no toxic chemicals · No harsh chemicals · No harsh fumes | EPA label, optional statements |
| Mild · A mild way to clean and disinfect | EPA label |
| No Personal Protective Equipment (gloves, goggles, masks or respirators) required for use · Use without gloves | EPA label, precautionary statements |
| Worry free use in baby rooms and nurseries | EPA label |
| No worries about pet licking after cleaning | EPA label |
| No rinsing necessary, even on food contact surfaces | EPA label |
| Leaves no chemical residue · Fragrance free · Non-flammable · Color-safe | EPA label |
| After use turns into harmless dilute saline solution | EPA label |
| Derived from naturally occurring minerals and pure water · All natural ingredients | EPA label |

### Product facts
- Active ingredient: hypochlorous acid 0.0134%. Use within 120 days of production, or test for
  at least 163 ppm free available chlorine before use (EPA label front panel).
- Keep out of reach of children. Do not use with other household chemicals.

## USDA Certified Organic line (not EPA-registered)
| Approved wording | Notes |
|---|---|
| USDA Certified Organic HOCl cleaner · Certified Organic by OTCO | Verify the current certificate and number |
| Multipurpose / everyday surface cleaner · Cleans and deodorizes · Removes everyday dirt and buildup | Cleaning only |
| Fragrance free · Ready to use · Made in Utah | If accurate |

**Never** for this line: disinfectant, sanitizer, antimicrobial, antibacterial, kills germs /
bacteria / viruses / mold, prevents mold, reduces infection, any kill % or contact time.

## Skin care (non-registered)
No healing, therapeutic, wound, treat or cure language. Keep the FDA statement:
"These statements have not been evaluated by the Food and Drug Administration. Products are not
intended to diagnose, treat, cure, or prevent any disease."

---

## Never allowed (any product line) — enforced by tests/claims.test.js
- Kill or disinfection times other than 10 minutes (no "10-second", "15–30 seconds", "instant").
- Organisms not on the label (MRSA, VRE, C. diff, norovirus, influenza, hepatitis, E. coli,
  Salmonella, Listeria, fungi, mold, spores, COVID / SARS-CoV-2, "superbugs").
- Killing, eliminating or preventing mold or mycotoxins.
- FDA approval or clearance, wound care, eye care, medical-device disinfection.
- "Safe", "100% safe", "non-toxic", "harmless", "chemical-free", "food/pet/family safe",
  "safe to inhale", "no risk".
- Comparisons with bleach or other products ("100x more effective"), star ratings,
  "no resistance".
- Disinfectant / antimicrobial / sanitizer claims for the USDA organic line.
- Presenting one product as both EPA-registered and USDA organic ("dual-certified").
- WHO, FSIS or FCN 1811 credentials until verified (FCN 1811's notifier is IET, Inc. /
  EcoloxTech; FSIS use depends on product, concentration and process).

## Open questions (Brandon / Sani-TEST)
Fogging, misting and HVAC/air-duct application are not in the label's directions (EPA guidance:
surface directions don't cover internal HVAC components). Re-entry times after fogging.
Whether OHS product is made under FCN 1811. Supplemental distributor paperwork (EPA Form
8570-5). Utah registration/licensing. Current USDA certificate number(s).
