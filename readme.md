# W13 Riemannian Geometry Methods and Tools for EEG preprocessing, analysis and classification

###### 8th International BCI Meeting: 2021 Virtual BCI meeting, June 7 – 9, 2021

Workshop W13 Session 4- Thursday, June 9, 9:00am – 11:00am (Pacific Time)
https://bcisociety.org/workshops/

Organizers:

- Marco Congedo, Gipsa-lab/CNRS, Univ. Grenoble Alpes
- Sylvain Chevallier, UVSQ, Université de Versailles Saint-Quentin-en-Yvelines
- Louis Korczowski, Independent Scientist
- Florian Yger, Université Paris-Dauphine
- Pierre Clisson, Independent Scientist


## Abstract
Riemannian Geometry (RG) is currently the object of growing interest within the BCI community. 
Machine learning methods based on RG have demonstrated robustness, accuracy and transfert learning capabilities for the classification of Motor Imagery, Event-Related Potential, Steady-State Visual Evoke Potentials, Sleep stages, as well as other mental states. 
This workshop will provide an overview of RG, emphasizing the characteristics that make RG compelling for BCI and its practical use for signal pre-processing, data analysis, mental state classification and regression. 
The workshop will be an opportunity for new users to solve real BCI problems (artifact removal, classification, transfert learning) with existing RG code resources and discuss the results.

## Intended audience
BCI reasearchers/Neuroscientist working with EEG/MEG that are interested by Riemannian Geometry but haven’t used it already or who want a deeper understanding of the underlying properties (going beyong CSP)

## Learning objectives
1. Understanding Riemannian Geometry, its history of application in BCI
2. Understanding the mathematical properties of Riemannian Geometry methods and the drawbacks
3. Being able to find a use a specific method/toolbox using RG for a given need (preprocessing/analysis/classification/regression)

## Timetable

### Part I: Introduction (60min)
- How Riemannian Geometry transformed BCI? (history, breakthroughs, example of applications) (20min) (M. Congedo)
- Why Riemannian Geometry works so well? (properties, computational speed, etc.) (20min)
- Existing code resources for Riemannian Geometry? ( Julia: PosDefManifoldML (Julia), Matlab: Covariance Tolbox, Python: pyriemann, MOABB, pymanop, geomstats, torchspdnet) (20 min) (All)

    BREAK (10min)

### Part II: Demonstrations (30min)
- "EEG Artifact removal with RG (Riemannian Potato)", using mne+pyriemman. (10min)
- "Implementing a RG classification pipeline with standard classifiers" (tangent space) using sklearn+pyriemann (10min)
- "Does the RG perform best all the time? A MOABB benchmarking" (S. Chevallier)  (10min)

### Part III: Coding Sessions & round-table  (70min)
- RG pipeline description and formation of groups. Demo and discussion of existing coding resources with an expert (10min).
- Using the same dataset, each group implement the demo using a different language while discussing the advantage/limitations with the expert (40min).
- The work of each group is presented to the others groups. (20min).

### Part 4: Open Discussion (10min)
    "Advantages and limitations of existing RG tools. Directions for future developments" 


# REFERENCES

Barthélemy Q, Mayaud Q, Ojeda D, Congedo M (2019)
The Riemannian Potato Field: a tool for online Signal Quality Index of EEG
IEEE Transactions on Neural Systems & Rehabilitation Engineering, 27 (2), 244-255 .

Bhatia R, Congedo M (2019)
Procrustes problems in manifolds of positive definite matrices
Linear Algebra and its Applications, 563, 440-445 .

Rodrigues PLC, Jutten C, Congedo M (2019)
Riemannian Procrustes Analysis : Transfer Learning for Brain-Computer Interfaces
IEEE Transactions on Biomedical Engineering, 66(8), 2390-2401.

Bouchard F, Malick J, Congedo M (2018)
Riemannian Optimization and Approximate Joint Diagonalization for Blind Source Separation
IEEE Transactions on Signal Processing, 66 (8), 2041-2054.

Lotte F, Bougrain L, Cichocki A, Clerc M, Congedo M, Rakotomamonjy A, Yger F (2018)
A Review of Classification Algorithms for EEG-based Brain-Computer Interfaces: A 10-year Update
Journal of Neural Engineering, 15(3):031005.

Zanini P, Congedo M, Jutten C, Said S, Berthoumieu Y (2018)
Transfer Learning: a Riemannian geometry framework with applications to Brain-Computer Interfaces
IEEE Transactions on Biomedical Engineering, 65(5), 1107-1116.

Congedo M, Barachant A, Bhatia R (2017)
Riemannian Geometry for EEG-based Brain-Computer Interfaces; a Primer and a Review
Brain-Computer Interfaces, 4(3), 155-174.

Congedo M, Barachant A, Kharati Koopaei E (2017)
Fixed Point Algorithms for Estimating Power Means of Positive Definite Matrices
IEEE Transactions on Signal Processing, 65(9), 2211-2220.

Mayaud L, Cabanilles S, Van Langhenhove A, Congedo M, Barachant A, Pouplin S, et al. (2016)
Brain-computer interface for the communication of acute patients: a feasibility study and a randomized controlled trial comparing performance with healthy participants and a traditional assistive device
Brain-Computer Interfaces, 3(4), 197-215.

Barachant A, Bonnet S, Congedo M, Jutten C (2013)
Classification of covariance matrices using a Riemannian-based kernel for BCI applications
Neurocomputing 112, 172-178.

Barachant A, Bonnet S, Congedo M, Jutten C (2012)
Multi-Class Brain Computer Interface Classification by Riemannian Geometry
IEEE Transactions on Biomedical Engineering 59(4), 920-928.

Yger, F., Berar, M., Lotte, F., (2017).
Riemannian Approaches in Brain-Computer Interfaces: A Review.
IEEE Transactions on Neural Systems and Rehabilitation Engineering 25, 1753–1762. 