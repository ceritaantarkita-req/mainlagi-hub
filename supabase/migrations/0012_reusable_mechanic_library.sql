-- Mainlagi reusable mechanic library (Batch 5)
-- Additive compatibility migration. Existing activity IDs, content packs,
-- attempts, mastery rows, and progression semantics remain unchanged.

alter table public.learning_activities
  drop constraint if exists learning_activities_mechanic_id_check;

alter table public.learning_activities
  add constraint learning_activities_mechanic_id_check
  check (
    mechanic_id is null or mechanic_id in (
      'tap_choice',
      'listen_and_choose',
      'matching',
      'guided_trace',
      'story',
      'coloring',
      'motion_game',
      'drag_to_target',
      'draw_line_matching',
      'sort_classify',
      'ordering_sequence',
      'pattern_completion',
      'odd_one_out',
      'connect_dots',
      'memory_pairs',
      'compare',
      'missing_item',
      'maze_path',
      'story_comprehension',
      'find_object'
    )
  );

alter table public.learning_activities
  drop constraint if exists learning_activities_evidence_contract_check;

alter table public.learning_activities
  add constraint learning_activities_evidence_contract_check
  check (
    evidence_contract is null or evidence_contract in (
      'choice_accuracy_v1',
      'matching_accuracy_v1',
      'target_accuracy_v1',
      'classification_accuracy_v1',
      'sequence_accuracy_v1',
      'guided_trace_path_v1',
      'path_quality_v1',
      'completion_only_v1'
    )
  );

comment on constraint learning_activities_mechanic_id_check on public.learning_activities is
  'Reusable mechanic vocabulary. New activities compose a known mechanic rather than inventing a one-off scoring runtime.';

comment on constraint learning_activities_evidence_contract_check on public.learning_activities is
  'Evidence vocabulary for reusable mechanics. Assessed content requires measured evidence; completion_only_v1 cannot manufacture mastery accuracy.';
