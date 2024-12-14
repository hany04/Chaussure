<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ChaussureRepository;
use App\Entity\Chaussure;
use App\Entity\Commande;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'app_default')]
    public function index(ChaussureRepository $lr): Response
    {
        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
            'Chaussures' => $lr->findAll(),
        ]);
    }
    #[Route('/item/{id}', name: 'app_item')]
    public function indexitem(ChaussureRepository $lr, int $id): Response
    {
        $Chaussure = $lr->find($id);
        if (!$Chaussure) {
            throw $this->createNotFoundException('Produit non trouvé.');
        }
        return $this->render('default/item.html.twig', [
            'Chaussure' => $Chaussure, 
        ]);
    }



//     #[Route('/acheter/{id}', name: 'app_default_acheter', methods: ['POST'])]
// public function acheter(
//     ChaussureRepository $ChaussureRepository,
//     CommandeRepository $commandeRepository,
//     EntityManagerInterface $entityManager,
//     int $id
// ): Response {
//     // Récupérer la Chaussure par son ID
//     $Chaussure = $ChaussureRepository->find($id);

//     // Vérifier si la Chaussure existe et est disponible
//     if (!$Chaussure || $Chaussure->getQuantite() <= 0) {
//         $this->addFlash('danger', 'Chaussure indisponible ou épuisée.');
//         return $this->redirectToRoute('app_default');
//     }

//     // Créer une nouvelle commande
//     $commande = new Commande();
//     $commande->setProduit($Chaussure->getModele());
//     $commande->setQuantite(1);
//     $commande->setPrix($Chaussure->getPrix());
//     $commande->setDateCommande(new \DateTime());

//     // Persister la commande
//     $entityManager->persist($commande);

//     // Diminuer la quantité de la Chaussure
//     $Chaussure->setQuantite($Chaussure->getQuantite() - 1);

//     // Sauvegarder les changements dans la base de données
//     $entityManager->flush();

//     // Ajouter un message flash pour l'utilisateur
//     $this->addFlash('success', 'Votre commande a été enregistrée avec succès !');

//     // Rediriger vers la page d'accueil ou une page de confirmation
//     return $this->redirectToRoute('app_default');
// }

#[Route('/achat/{id}', name: 'app_default_achat', methods: ['POST'])]
// #[IsGranted('ROLE_USER')]
    public function acheter(
        Chaussure $Chaussure,
        EntityManagerInterface $entityManager,
        Security $security
    ): Response {
        if ($Chaussure->getQuantite() <= 0) {
            $this->addFlash('danger', 'Cette Chaussure est indisponible.');
            return $this->redirectToRoute('app_default');
        }

        $user = $security->getUser();
        if (!$user) {
            $this->addFlash('danger', 'Vous devez être connecté pour effectuer cet achat.');
            return $this->redirectToRoute('app_login');
        }

        $commande = new Commande();
        $commande->setChaussure($Chaussure);
        $commande->setQuantite(1); 
        $commande->setPrix($Chaussure->getPrix());
        $commande->setDate(new \DateTime());

        $commande->setUser($user);

        $Chaussure->setQuantite($Chaussure->getQuantite() - 1);

        $entityManager->persist($commande);
        $entityManager->persist($Chaussure);
        $entityManager->flush();

    $this->addFlash('success', 'Commande effectuée avec succès.');
    return $this->redirectToRoute('app_default', ['success' => 1]);
    }
}
