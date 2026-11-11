-- A source being public or having a free-form license label is not enough to
-- claim commercial reuse. Preserve true only for recognized permissive license
-- identifiers / explicit permission, false for explicit non-commercial terms,
-- and NULL when the license cannot be recognized from the stored value.
UPDATE mobility_providers
SET commercial_use = CASE
      WHEN license ~* 'non[ -]?commercial|cc[ -]?by[ -]?nc([ -]?(sa|nd))?' THEN false
      WHEN license ~* 'commercial use permitted' THEN true
      WHEN license ~* 'cc[ -]?0|cc[ -]?by([ -]?(sa|nd))?([[:space:]]*[0-9](\.[0-9])?)?|odbl|open database license|odc[ -]?by|open data commons attribution license|pddl' THEN true
      ELSE NULL
    END,
    updated_at = now()
WHERE access = 'open';
