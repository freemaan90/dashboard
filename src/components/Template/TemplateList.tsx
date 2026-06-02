"use client";
import { Template } from "@/interfaces/Template.interface";
import styles from "./TemplateList.module.css";
import { Button } from "../ui/Button/Button";
import { Icon } from "../ui/Icon/Icon";
import { deleteTemolate } from "@/app/actions/Templates";

export const TemplateList = ({
  templates,
  accessToken,
}: {
  accessToken: string;
  templates: Template[];
}) => {

  const handleUpdate = async (templateId:number) => {
    console.log(templateId)
  }

  const handleDelete = async (templateId: number) => {
    await deleteTemolate(accessToken, templateId);
  };

  return (
    <div className={styles.listSection}>
      <h2 className={styles.listTitle}>
        Tus templates
        {templates.length > 0 && (
          <span className={styles.templateCount}>({templates.length})</span>
        )}
      </h2>

      {templates.length === 0 ? (
        <p className={styles.empty}>
          No tenés templates todavía. ¡Creá el primero!
        </p>
      ) : (
        <ul className={styles.list}>
          {templates
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((t) => (
              <li key={t.id} className={styles.item}>
                <div className={styles.templateItemContainer}>
                  <div>
                    <h3 className={styles.itemTitle}>{t.title}</h3>
                    <p className={styles.itemContent}>{t.content}</p>
                    <p className={styles.itemDate}>
                      Actualizado:{" "}
                      {new Date(t.updatedAt).toLocaleString("es-AR")}
                    </p>
                  </div>

                  <div className={styles.buttonsContainer}>
                    <div className={styles.buttons}>
                      <div className={styles.applyButtonContainer}>
                        <Button
                          variant="primary"
                          size="sm"
                          className={styles.buttonApply}
                        >
                          Aplicar
                        </Button>
                      </div>
                      <div className={styles.editDeleteContainer}>
                        <Button
                          variant="outline"
                          size="sm"
                          leadingIcon={<Icon name="Edit" size={16} />}
                          onClick={()=>handleUpdate(t.id)}
                        >
                          Editar
                        </Button>
                        {/* <DeleteButton /> */}
                        <Button
                          variant="danger"
                          size="sm"
                          leadingIcon={<Icon name="Trash2" size={16} />}
                          onClick={() => handleDelete(t.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
