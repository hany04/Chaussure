<?php

namespace App\Controller;

use App\Entity\Chaussure;
use App\Entity\Commande;
use App\Form\ChaussureType;
use App\Repository\ChaussureRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/admin/Chaussure')]
class ChaussureController extends AbstractController
{
    private $slugger;

    public function __construct(SluggerInterface $slugger)
    {
        $this->slugger = $slugger;
    }

    #[Route('/', name: 'app_Chaussure_index', methods: ['GET'])]
    public function index(ChaussureRepository $ChaussureRepository): Response
    {
        return $this->render('Chaussure/index.html.twig', [
            'Chaussures' => $ChaussureRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_Chaussure_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $Chaussure = new Chaussure();
        $form = $this->createForm(ChaussureType::class, $Chaussure);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('photo')->getData();

            if ($imageFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $this->slugger->slug($originalFilename); 
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

                try {
                    $imageFile->move(
                        $this->getParameter('images_directory'), 
                        $newFilename
                    );
                } catch (FileException $e) {
                }

                $Chaussure->setPhoto($newFilename);
            }

            $entityManager->persist($Chaussure);
            $entityManager->flush();

            return $this->redirectToRoute('app_Chaussure_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('Chaussure/new.html.twig', [
            'Chaussure' => $Chaussure,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_Chaussure_show', methods: ['GET'])]
    public function show(Chaussure $Chaussure): Response
    {
        return $this->render('Chaussure/show.html.twig', [
            'Chaussure' => $Chaussure,
        ]);
    }
    
    #[Route('/{id}/edit', name: 'app_Chaussure_edit', methods: ['GET', 'POST'])]
public function edit(Request $request, Chaussure $Chaussure, EntityManagerInterface $entityManager): Response
{
    $form = $this->createForm(ChaussureType::class, $Chaussure);
    $form->handleRequest($request);

    // Stocker l'ancienne photo
    $originalPhoto = $Chaussure->getPhoto();

    if ($form->isSubmitted() && $form->isValid()) {
        // Récupérer le fichier photo soumis dans le formulaire
        $imageFile = $form->get('photo')->getData();

        if ($imageFile) {
            if ($originalPhoto) {
                $oldImagePath = $this->getParameter('images_directory') . '/' . $originalPhoto;
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $this->slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

            try {
                $imageFile->move(
                    $this->getParameter('images_directory'),
                    $newFilename
                );
            } catch (FileException $e) {
            }

            $Chaussure->setPhoto($newFilename);
        } else {
            $Chaussure->setPhoto($originalPhoto);
        }

        $entityManager->flush();

        return $this->redirectToRoute('app_Chaussure_index', [], Response::HTTP_SEE_OTHER);
    }

    return $this->renderForm('Chaussure/edit.html.twig', [
        'Chaussure' => $Chaussure,
        'form' => $form,
    ]);
}

    #[Route('/{id}', name: 'app_Chaussure_delete', methods: ['POST'])]
public function delete(Request $request, Chaussure $Chaussure, EntityManagerInterface $entityManager): Response
{
    if ($this->isCsrfTokenValid('delete'.$Chaussure->getId(), $request->request->get('_token'))) {
        // Find and remove all commandes related to this Chaussure
        $commandes = $entityManager->getRepository(Commande::class)->findBy(['Chaussure' => $Chaussure]);
        foreach ($commandes as $commande) {
            $entityManager->remove($commande);
        }

        // Now remove the Chaussure
        $entityManager->remove($Chaussure);
        $entityManager->flush();
    }

    return $this->redirectToRoute('app_Chaussure_index', [], Response::HTTP_SEE_OTHER);
}

}
