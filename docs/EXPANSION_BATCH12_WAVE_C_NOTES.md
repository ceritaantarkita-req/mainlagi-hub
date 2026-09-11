# Expansion Batch 12 — Logic/Logika Wave C

Wave C raises Logic/Logika from 50 to 75 activities with 25 measured assessed activities.

Scope: conditional rules, multi-attribute classification, everyday analogies, relative ordering, and elimination/inference. Every new activity uses an existing measured `tap_choice` or `matching` evidence path (`choice_accuracy_v1` / `matching_accuracy_v1`). Wave C adds no completion-only practice and changes no historical mastery identity.

Expected catalog after Wave C: 580 activities, 561 assessed / 19 practice, 33 stages, 132 lessons, 132 packs, and 135 skills. Logic becomes exactly 75 assessed / 0 practice.

Production closure requires PR CI green, migration `0037_batch12_logic_wave_c.sql` on canonical Supabase, live count verification, advisor review, squash merge, and exact-SHA Cloudflare production smoke success.
