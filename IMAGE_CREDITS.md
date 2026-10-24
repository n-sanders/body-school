# Image Credits — Body School

Figures live in `public/images/` and are never hotlinked. Two groups are used:

- **Body School diagrams** (`images/organs/*.svg` and the lesson SVGs that are not named `sourced-*`) were drawn for this course by `scripts/make-body-images.py`. They are original diagrams for this project. Organ diagrams have no visible labels so recognition quizzes cannot be answered by reading a name.
- **Sourced figures** (`images/lessons/sourced-*`) were downloaded from Wikimedia Commons by `scripts/download-sourced-images.py`. The script checks the live license and accepts only public domain, CC0, CC BY, and CC BY-SA.

OpenStax Anatomy & Physiology (CC BY 4.0) supplied the bone-growth figure below and is the main text source for the lessons. Servier Medical Art was considered as a diagram source and was not needed once these Commons and original figures were in place.

## Organ diagrams (42)

Each catalog organ has an unlabeled recognition drawing and a second drawing placed on a simple body outline. Both are original.

| Local files | What they show |
| --- | --- |
| `organs/skull-diagram.svg`, `organs/skull-context.svg` | Cranium, jaw, eye openings, and teeth |
| `organs/rib-cage-diagram.svg`, `organs/rib-cage-context.svg` | Breastbone and paired ribs |
| `organs/spine-diagram.svg`, `organs/spine-context.svg` | Stacked vertebrae |
| `organs/skeletal-muscle-diagram.svg`, `organs/skeletal-muscle-context.svg` | Muscle beside a bone |
| `organs/heart-diagram.svg`, `organs/heart-context.svg` | Four-chamber pump |
| `organs/blood-vessels-diagram.svg`, `organs/blood-vessels-context.svg` | Branching vessels |
| `organs/lungs-diagram.svg`, `organs/lungs-context.svg` | Windpipe and two lungs |
| `organs/diaphragm-diagram.svg`, `organs/diaphragm-context.svg` | Dome of muscle under the lungs |
| `organs/stomach-diagram.svg`, `organs/stomach-context.svg` | J-shaped stomach |
| `organs/liver-diagram.svg`, `organs/liver-context.svg` | Liver and gallbladder |
| `organs/pancreas-diagram.svg`, `organs/pancreas-context.svg` | Long gland across the belly |
| `organs/small-intestine-diagram.svg`, `organs/small-intestine-context.svg` | Coiled narrow tube |
| `organs/large-intestine-diagram.svg`, `organs/large-intestine-context.svg` | Wider tube around a coil |
| `organs/kidneys-diagram.svg`, `organs/kidneys-context.svg` | Two kidneys and a bladder |
| `organs/brain-diagram.svg`, `organs/brain-context.svg` | Cerebrum, cerebellum, and brainstem |
| `organs/spinal-cord-diagram.svg`, `organs/spinal-cord-context.svg` | Cord, vertebrae, and nerve branches |
| `organs/thyroid-gland-diagram.svg`, `organs/thyroid-gland-context.svg` | Butterfly-shaped gland on the windpipe |
| `organs/adrenal-glands-diagram.svg`, `organs/adrenal-glands-context.svg` | Caps on the kidneys |
| `organs/skin-diagram.svg`, `organs/skin-context.svg` | Skin layers, hair, and a gland |
| `organs/lymph-nodes-diagram.svg`, `organs/lymph-nodes-context.svg` | Nodes along vessels |
| `organs/spleen-diagram.svg`, `organs/spleen-context.svg` | Spleen beside the stomach |

## Lesson diagrams made for Body School (24)

Original labeled teaching figures from `scripts/make-body-images.py`.

| Local file | Used in |
| --- | --- |
| `lessons/organization-01-levels.svg` | organization-01 |
| `lessons/organization-01-tissues.svg` | organization-01 |
| `lessons/organization-02-organ-from-tissues.svg` | organization-02 |
| `lessons/organization-03-systems-link.svg` | organization-03 |
| `lessons/support-01-skeleton-jobs.svg` | support-01 |
| `lessons/support-01-joint-types.svg` | support-01 |
| `lessons/support-02-muscle-types.svg` | support-02 |
| `lessons/support-03-muscle-pairs.svg` | support-03 |
| `lessons/circulation-01-heart-path.svg` | circulation-01 |
| `lessons/circulation-02-three-vessels.svg` | circulation-02 |
| `lessons/circulation-03-air-path.svg` | circulation-03 |
| `lessons/circulation-03-gas-exchange.svg` | circulation-03 |
| `lessons/fuel-01-sandwich-path.svg` | fuel-01 |
| `lessons/fuel-02-absorption.svg` | fuel-02 |
| `lessons/fuel-03-kidney-filter.svg` | fuel-03 |
| `lessons/control-01-nerve-signal.svg` | control-01 |
| `lessons/control-02-hormone-message.svg` | control-02 |
| `lessons/control-03-feedback-loop.svg` | control-03 |
| `lessons/protection-01-skin-jobs.svg` | protection-01 |
| `lessons/protection-02-immune-team.svg` | protection-02 |
| `lessons/protection-03-two-defenses.svg` | protection-03 |
| `lessons/together-01-exercise-chain.svg` | together-01 |
| `lessons/together-02-meal-chain.svg` | together-02 |
| `lessons/together-03-connections.svg` | together-03 |

## Sourced figures (20)

| Local file | Commons file | Creator | License | Used in |
| --- | --- | --- | --- | --- |
| `sourced-skeleton.svg` | [Human skeleton front en.svg](https://commons.wikimedia.org/wiki/File:Human_skeleton_front_en.svg) | Mariana Ruiz Villarreal (LadyofHats) | Public domain | support-01 |
| `sourced-muscle-tissues.jpg` | [Illu muscle tissues.jpg](https://commons.wikimedia.org/wiki/File:Illu_muscle_tissues.jpg) | National Cancer Institute SEER | Public domain | support-02 |
| `sourced-muscle-structure.jpg` | [Illu muscle structure.jpg](https://commons.wikimedia.org/wiki/File:Illu_muscle_structure.jpg) | National Cancer Institute SEER | Public domain | support-03 |
| `sourced-bone-growth.jpg` | [622 Longitudinal Bone Growth.jpg](https://commons.wikimedia.org/wiki/File:622_Longitudinal_Bone_Growth.jpg) | OpenStax College | CC BY 4.0 | support-01 |
| `sourced-heart-flow.svg` | [Heart diagram blood flow en.svg](https://commons.wikimedia.org/wiki/File:Heart_diagram_blood_flow_en.svg) | ZooFari | CC BY-SA 3.0 | circulation-01 |
| `sourced-respiratory.svg` | [Respiratory system complete en.svg](https://commons.wikimedia.org/wiki/File:Respiratory_system_complete_en.svg) | Mariana Ruiz Villarreal (LadyofHats) | Public domain | circulation-03 |
| `sourced-alveoli.svg` | [Alveoli.svg](https://commons.wikimedia.org/wiki/File:Alveoli.svg) | helix84 | CC BY 2.5 | circulation-03 |
| `sourced-digestive.svg` | [Digestive system diagram en.svg](https://commons.wikimedia.org/wiki/File:Digestive_system_diagram_en.svg) | Mariana Ruiz Villarreal (LadyofHats) | Public domain | fuel-01 |
| `sourced-intestines.svg` | [Stomach colon rectum diagram-en.svg](https://commons.wikimedia.org/wiki/File:Stomach_colon_rectum_diagram-en.svg) | Indolences and Medium69 | Public domain | fuel-02 |
| `sourced-urinary.jpg` | [Illu urinary system.jpg](https://commons.wikimedia.org/wiki/File:Illu_urinary_system.jpg) | National Cancer Institute SEER | Public domain | fuel-03 |
| `sourced-nephron.png` | [Kidney nephron.png](https://commons.wikimedia.org/wiki/File:Kidney_nephron.png) | Henry Gray | Public domain | fuel-03 |
| `sourced-brain.svg` | [Human head and brain diagram.svg](https://commons.wikimedia.org/wiki/File:Human_head_and_brain_diagram.svg) | Patrick J. Lynch | CC BY 2.5 | control-01 |
| `sourced-neuron.svg` | [Neuron.svg](https://commons.wikimedia.org/wiki/File:Neuron.svg) | Dhp1080 | CC BY-SA 3.0 | control-01 |
| `sourced-endocrine.jpg` | [Illu endocrine system.jpg](https://commons.wikimedia.org/wiki/File:Illu_endocrine_system.jpg) | National Cancer Institute SEER | Public domain | control-02 |
| `sourced-thyroid.jpg` | [Illu thyroid parathyroid.jpg](https://commons.wikimedia.org/wiki/File:Illu_thyroid_parathyroid.jpg) | National Cancer Institute SEER | Public domain | control-02 |
| `sourced-adrenal.jpg` | [Illu adrenal gland.jpg](https://commons.wikimedia.org/wiki/File:Illu_adrenal_gland.jpg) | National Cancer Institute SEER | Public domain | control-02 |
| `sourced-pituitary.jpg` | [Illu pituitary pineal glands.jpg](https://commons.wikimedia.org/wiki/File:Illu_pituitary_pineal_glands.jpg) | National Cancer Institute SEER | Public domain | control-02 |
| `sourced-skin-layers.svg` | [Skin layers.svg](https://commons.wikimedia.org/wiki/File:Skin_layers.svg) | Madhero88 and M.Komorniczak | CC BY-SA 3.0 | protection-01 |
| `sourced-lymphatic.jpg` | [Illu lymphatic system.jpg](https://commons.wikimedia.org/wiki/File:Illu_lymphatic_system.jpg) | National Cancer Institute SEER | Public domain | protection-02 |
| `sourced-lymph-node.svg` | [Diagram of a lymph node CRUK 022.svg](https://commons.wikimedia.org/wiki/File:Diagram_of_a_lymph_node_CRUK_022.svg) | Cancer Research UK | CC BY-SA 4.0 | protection-02 |

`sourced-bone-growth.jpg` and `sourced-pituitary.jpg` are kept as credited reference figures for bone growth and the pituitary. Lesson prose points at the OpenStax bone-growth explanation and the pituitary in the endocrine overview; the files are part of the sourced set recorded here.

CC BY and CC BY-SA figures are reused with the creator and license named in the lesson caption and in this table. Changes were limited to saving the Commons file locally.
