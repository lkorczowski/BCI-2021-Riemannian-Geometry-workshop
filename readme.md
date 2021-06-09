# W13 Riemannian Geometry Methods and Tools for EEG preprocessing, analysis and classification

NOTE: if you participated to the workshop, please take 2min to give us your feedback to improve the material https://iyrp0g0k85t.typeform.com/to/g6Mcub4o

###### 8th International BCI Meeting: 2021 Virtual BCI meeting, June 7 – 9, 2021

Workshop W13 Session 4- Thursday, June 9, 9:00am – 11:00am (Pacific Time)
https://bcisociety.org/workshops/

Organizers:

- Marco Congedo, Gipsa-lab/CNRS, Univ. Grenoble Alpes
- Sylvain Chevallier, UVSQ, Université de Versailles Saint-Quentin-en-Yvelines
- Louis Korczowski, Independent Scientist & Siopi.ai
- Florian Yger, Université Paris-Dauphine
- Pierre Clisson, Independent Scientist

## News & Updates

2021-06-04 The initial workshop was planed as a 3-hour long workshop with Coding Session & Roundtable. In order to make it more compatible to remote 2-hours format, the schedule is being changed.

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

### Introduction

### Part I: Talk and Q&A (50 min)
- How Riemannian Geometry transformed BCI? (history, breakthroughs, example of applications) by Marco Congedo. Talk + Q&A.
- Why Riemannian Geometry works so well? (properties, computational speed, etc.) by Florian Yger. Talk + Q&A.


### Part II: Demonstrations & Discussions (50 min)
*Because of the virtual format, we couldn't organize the coding sessions associated with the demonstration but all the code will be accessible after the workshop. Each demo will consist of a short introduction, code demo and Q&A.*

- "Automatical tag of your EEG artifacts with a Riemannian Potato and get better results using MNE+pyRiemann" by Louis Korczowski.
- "Upgrading your standard classification pipeline with a simple RG trick using sklearn+pyRiemann" by Louis Korczowski.
- "Evaluating BCI pipelines across datasets: the Mother of All BCI Benchmarks" by Sylvain Chevallier.
- "Building a realtime realtime ERP speller using Riemannian Geometry and Timeflux" by Pierre Clisson.

### Part III: Discussion on future challenges (10min)


# REFERENCES

Barachant A, Bonnet S, Congedo M, Jutten C (2012)
Multi-Class Brain Computer Interface Classification by Riemannian Geometry
IEEE Transactions on Biomedical Engineering 59(4), 920-928.

Barachant A, Bonnet S, Congedo M, Jutten C (2013)
Classification of covariance matrices using a Riemannian-based kernel for BCI applications
Neurocomputing 112, 172-178.

Horev, I, Yger, F, Sugiyama, M (2016)
Geometry-aware principal component analysis for symmetric positive definite matrices
Machine LearningACML, 1-30

Mayaud L, Cabanilles S, Van Langhenhove A, Congedo M, Barachant A, Pouplin S, et al. (2016)
Brain-computer interface for the communication of acute patients: a feasibility study and a randomized controlled trial comparing performance with healthy participants and a traditional assistive device
Brain-Computer Interfaces, 3(4), 197-215.

Kalunga EK, Chevallier S, Djouani K, Monacelli E, Hamam Y (2016)
Online SSVEP-based BCI using Riemannian Geometry
Neurocomputing 191, 55-68

Yger, F., Berar, M., Lotte, F., (2017).
Riemannian Approaches in Brain-Computer Interfaces: A Review.
IEEE Transactions on Neural Systems and Rehabilitation Engineering 25, 1753–1762.

Congedo M, Barachant A, Bhatia R (2017)
Riemannian Geometry for EEG-based Brain-Computer Interfaces; a Primer and a Review
Brain-Computer Interfaces, 4(3), 155-174.

Congedo M, Barachant A, Kharati Koopaei E (2017)
Fixed Point Algorithms for Estimating Power Means of Positive Definite Matrices
IEEE Transactions on Signal Processing, 65(9), 2211-2220.

Bouchard F, Malick J, Congedo M (2018)
Riemannian Optimization and Approximate Joint Diagonalization for Blind Source Separation
IEEE Transactions on Signal Processing, 66 (8), 2041-2054.

Kalunga, EK, Chevallier, S, and Barthélemy, Q (2018)
Transfer learning for SSVEP-based BCI using Riemannian similarities between users
European Signal Processing Conference (EUSIPCO), 2018

Lotte F, Bougrain L, Cichocki A, Clerc M, Congedo M, Rakotomamonjy A, Yger F (2018)
A Review of Classification Algorithms for EEG-based Brain-Computer Interfaces: A 10-year Update
Journal of Neural Engineering, 15(3):031005.

Zanini P, Congedo M, Jutten C, Said S, Berthoumieu Y (2018)
Transfer Learning: a Riemannian geometry framework with applications to Brain-Computer Interfaces
IEEE Transactions on Biomedical Engineering, 65(5), 1107-1116.

Barthélemy Q, Mayaud Q, Ojeda D, Congedo M (2019)
The Riemannian Potato Field: a tool for online Signal Quality Index of EEG
IEEE Transactions on Neural Systems & Rehabilitation Engineering, 27 (2), 244-255 .

Bhatia R, Congedo M (2019)
Procrustes problems in manifolds of positive definite matrices
Linear Algebra and its Applications, 563, 440-445 .

Rodrigues PLC, Jutten C, Congedo M (2019)
Riemannian Procrustes Analysis : Transfer Learning for Brain-Computer Interfaces
IEEE Transactions on Biomedical Engineering, 66(8), 2390-2401.

Yger, F, Chevallier, S, Barthélemy, Q, and Sra, S (2020) 
Geodesically-convex optimization for averaging partially observed covariance matrices
Asian Conference on Machine Learning

Khazem, S, Chevallier, S, Barthélemy, Q, Haroun, K, Noûs, C (2021)
Minimizing Subject-dependent Calibration for BCI with Riemannian Transfer Learning
IEEE EMBS NER

Chevallier S, Kalunga EK, Barthélemy Q, Monacelli E (2021)
Review of Riemannian distances and divergences, applied to SSVEP-based BCI
Neuroinformatics 19 (1), 93-106
